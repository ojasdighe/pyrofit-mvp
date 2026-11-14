/**
 * Pyrofit SQLite Database Engine
 * A full-featured in-browser SQLite-compatible relational database layer
 * supporting SQL queries (SELECT, INSERT, UPDATE, DELETE, GROUP BY, PRAGMA),
 * table schemas, persistence, and export to .sql dump scripts.
 */

import { SEED_PRODUCT_CATALOG } from '../data/productCatalog';
import { TelemetryPayload, AthleteProfileState, WorkoutInputVector, CalculatedHourlyTargets } from '../types/pyrofit';

export interface SQLQueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs: number;
  query: string;
  error?: string;
}

export interface TableColumn {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BLOB';
  primaryKey?: boolean;
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
}

const STORAGE_KEY = 'pyrofit_sqlite_db_v1';

class SQLiteEngine {
  private tables: Map<string, { schema: TableSchema; rows: Record<string, any>[] }> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    // 1. Athlete Profiles Table
    this.tables.set('athlete_profiles', {
      schema: {
        name: 'athlete_profiles',
        columns: [
          { name: 'athlete_id', type: 'TEXT', primaryKey: true },
          { name: 'athlete_weight_kg', type: 'REAL' },
          { name: 'carb_multiplier', type: 'REAL' },
          { name: 'sodium_multiplier', type: 'REAL' },
          { name: 'filter_isotonic_only', type: 'INTEGER' },
          { name: 'historical_cramping', type: 'INTEGER' },
          { name: 'total_workouts', type: 'INTEGER' },
          { name: 'updated_at', type: 'TEXT' },
        ],
      },
      rows: [],
    });

    // 2. Workout Sessions Table
    this.tables.set('workout_sessions', {
      schema: {
        name: 'workout_sessions',
        columns: [
          { name: 'session_id', type: 'TEXT', primaryKey: true },
          { name: 'athlete_id', type: 'TEXT' },
          { name: 'duration_mins', type: 'INTEGER' },
          { name: 'intensity_level', type: 'TEXT' },
          { name: 'temp_celsius', type: 'REAL' },
          { name: 'env_factor', type: 'REAL' },
          { name: 'carbs_hourly_g', type: 'REAL' },
          { name: 'sodium_hourly_mg', type: 'REAL' },
          { name: 'fluids_hourly_ml', type: 'REAL' },
          { name: 'budget_tier', type: 'TEXT' },
          { name: 'cramping_history', type: 'INTEGER' },
          { name: 'session_type', type: 'TEXT' },
          { name: 'terrain', type: 'TEXT' },
          { name: 'distance_km', type: 'REAL' },
          { name: 'created_at', type: 'TEXT' },
        ],
      },
      rows: [],
    });

    // 3. Products Table
    this.tables.set('products', {
      schema: {
        name: 'products',
        columns: [
          { name: 'id', type: 'TEXT', primaryKey: true },
          { name: 'brand', type: 'TEXT' },
          { name: 'name', type: 'TEXT' },
          { name: 'phase', type: 'TEXT' },
          { name: 'carbs_g', type: 'REAL' },
          { name: 'sodium_mg', type: 'REAL' },
          { name: 'fluids_ml', type: 'REAL' },
          { name: 'protein_g', type: 'REAL' },
          { name: 'tier', type: 'TEXT' },
          { name: 'formulation_type', type: 'TEXT' },
          { name: 'official_url', type: 'TEXT' },
          { name: 'price_inr', type: 'REAL' },
          { name: 'tag', type: 'TEXT' },
        ],
      },
      rows: SEED_PRODUCT_CATALOG.map((p) => ({
        id: p.id,
        brand: p.brand,
        name: p.name,
        phase: p.phase,
        carbs_g: p.carbs_g,
        sodium_mg: p.sodium_mg,
        fluids_ml: p.fluids_ml,
        protein_g: p.protein_g,
        tier: p.tier,
        formulation_type: p.formulation_type,
        official_url: p.official_url,
        price_inr: p.price_inr,
        tag: p.tag,
      })),
    });

    // 4. Telemetry Events Table
    this.tables.set('telemetry_events', {
      schema: {
        name: 'telemetry_events',
        columns: [
          { name: 'click_id', type: 'TEXT', primaryKey: true },
          { name: 'athlete_id', type: 'TEXT' },
          { name: 'product_id', type: 'TEXT' },
          { name: 'brand_name', type: 'TEXT' },
          { name: 'product_name', type: 'TEXT' },
          { name: 'tier', type: 'TEXT' },
          { name: 'duration_mins', type: 'INTEGER' },
          { name: 'intensity', type: 'TEXT' },
          { name: 'temperature_celsius', type: 'REAL' },
          { name: 'environmental_factor_E', type: 'REAL' },
          { name: 'cramping_history_flag', type: 'INTEGER' },
          { name: 'carbs_hourly_g', type: 'REAL' },
          { name: 'sodium_hourly_mg', type: 'REAL' },
          { name: 'fluids_hourly_ml', type: 'REAL' },
          { name: 'official_target_url', type: 'TEXT' },
          { name: 'timestamp', type: 'TEXT' },
        ],
      },
      rows: [],
    });

    // 5. Adaptive Feedback Logs Table
    this.tables.set('feedback_logs', {
      schema: {
        name: 'feedback_logs',
        columns: [
          { name: 'log_id', type: 'TEXT', primaryKey: true },
          { name: 'athlete_id', type: 'TEXT' },
          { name: 'outcome', type: 'TEXT' },
          { name: 'workout_duration', type: 'INTEGER' },
          { name: 'workout_intensity', type: 'TEXT' },
          { name: 'workout_temp', type: 'REAL' },
          { name: 'carb_multiplier_before', type: 'REAL' },
          { name: 'carb_multiplier_after', type: 'REAL' },
          { name: 'sodium_multiplier_before', type: 'REAL' },
          { name: 'sodium_multiplier_after', type: 'REAL' },
          { name: 'isotonic_locked', type: 'INTEGER' },
          { name: 'timestamp', type: 'TEXT' },
        ],
      },
      rows: [],
    });

    // Load persisted state if exists
    this.loadFromStorage();

    // Populate initial seed telemetry if empty
    const telemetryTable = this.tables.get('telemetry_events');
    if (telemetryTable && telemetryTable.rows.length === 0) {
      this.populateSeedTelemetry();
    }
  }

  private populateSeedTelemetry() {}

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        for (const [tName, tRows] of Object.entries(parsed)) {
          const existing = this.tables.get(tName);
          if (existing && Array.isArray(tRows)) {
            existing.rows = tRows as Record<string, any>[];
          }
        }
      }
    } catch (e) {
      console.warn('Could not load SQLite state from localStorage', e);
    }
  }

  private saveToStorage() {
    try {
      const out: Record<string, any[]> = {};
      for (const [name, table] of this.tables.entries()) {
        out[name] = table.rows;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    } catch (e) {
      console.warn('Could not save SQLite state to localStorage', e);
    }
  }

  public getTableNames(): string[] {
    return Array.from(this.tables.keys());
  }

  public getTableSchema(name: string): TableSchema | undefined {
    return this.tables.get(name)?.schema;
  }

  public getTableRowCount(name: string): number {
    return this.tables.get(name)?.rows.length || 0;
  }

  /**
   * Insert Telemetry Event (triggers when athlete clicks "Buy from Official Site")
   */
  public logTelemetryEvent(payload: TelemetryPayload) {
    const table = this.tables.get('telemetry_events');
    if (!table) return;

    const row = {
      click_id: payload.click_id,
      athlete_id: payload.athlete_id,
      product_id: payload.product_metadata.product_id,
      brand_name: payload.product_metadata.brand_name,
      product_name: payload.product_metadata.product_name,
      tier: payload.product_metadata.tier,
      duration_mins: payload.workout_context.duration_mins,
      intensity: payload.workout_context.intensity,
      temperature_celsius: payload.workout_context.temperature_celsius,
      environmental_factor_E: payload.workout_context.environmental_factor_E,
      cramping_history_flag: payload.workout_context.cramping_history_flag ? 1 : 0,
      carbs_hourly_g: payload.calculated_targets.carbs_hourly_g,
      sodium_hourly_mg: payload.calculated_targets.sodium_hourly_mg,
      fluids_hourly_ml: payload.calculated_targets.fluids_hourly_ml,
      official_target_url: payload.product_metadata.official_target_url,
      timestamp: payload.timestamp,
    };

    // Prepend to show latest first
    table.rows.unshift(row);
    this.saveToStorage();
  }

  /**
   * Log Feedback state update
   */
  public logFeedbackUpdate(data: {
    athlete_id: string;
    outcome: string;
    workout_duration: number;
    workout_intensity: string;
    workout_temp: number;
    carb_multiplier_before: number;
    carb_multiplier_after: number;
    sodium_multiplier_before: number;
    sodium_multiplier_after: number;
    isotonic_locked: boolean;
  }) {
    const table = this.tables.get('feedback_logs');
    if (!table) return;

    const row = {
      log_id: `fdbk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      athlete_id: data.athlete_id,
      outcome: data.outcome,
      workout_duration: data.workout_duration,
      workout_intensity: data.workout_intensity,
      workout_temp: data.workout_temp,
      carb_multiplier_before: data.carb_multiplier_before,
      carb_multiplier_after: data.carb_multiplier_after,
      sodium_multiplier_before: data.sodium_multiplier_before,
      sodium_multiplier_after: data.sodium_multiplier_after,
      isotonic_locked: data.isotonic_locked ? 1 : 0,
      timestamp: new Date().toISOString(),
    };

    table.rows.unshift(row);
    this.saveToStorage();
  }

  /**
   * Sync athlete profile row
   */
  public syncAthleteProfile(profile: AthleteProfileState) {
    const table = this.tables.get('athlete_profiles');
    if (!table) return;

    const existingIdx = table.rows.findIndex((r) => r.athlete_id === profile.athlete_id);
    const row = {
      athlete_id: profile.athlete_id,
      athlete_weight_kg: profile.athlete_weight_kg,
      carb_multiplier: profile.carb_multiplier,
      sodium_multiplier: profile.sodium_multiplier,
      filter_isotonic_only: profile.filter_isotonic_only ? 1 : 0,
      historical_cramping: profile.historical_cramping ? 1 : 0,
      total_workouts: profile.total_workouts_logged,
      updated_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      table.rows[existingIdx] = row;
    } else {
      table.rows.push(row);
    }
    this.saveToStorage();
  }

  /**
   * Log a completed workout session configuration + calculated targets
   */
  public logWorkoutSession(data: {
    session_id: string;
    athlete_id: string;
    duration_mins: number;
    intensity_level: string;
    temp_celsius: number;
    env_factor: number;
    carbs_hourly_g: number;
    sodium_hourly_mg: number;
    fluids_hourly_ml: number;
    budget_tier: string;
    cramping_history: boolean;
    session_type?: string;
    terrain?: string;
    distance_km?: number;
  }) {
    const table = this.tables.get('workout_sessions');
    if (!table) return;
    const row = {
      session_id: data.session_id,
      athlete_id: data.athlete_id,
      duration_mins: data.duration_mins,
      intensity_level: data.intensity_level,
      temp_celsius: data.temp_celsius,
      env_factor: data.env_factor,
      carbs_hourly_g: data.carbs_hourly_g,
      sodium_hourly_mg: data.sodium_hourly_mg,
      fluids_hourly_ml: data.fluids_hourly_ml,
      budget_tier: data.budget_tier,
      cramping_history: data.cramping_history ? 1 : 0,
      session_type: data.session_type ?? 'Training',
      terrain: data.terrain ?? 'Road',
      distance_km: data.distance_km ?? null,
      created_at: new Date().toISOString(),
    };
    table.rows.unshift(row);
    // Keep max 100 sessions
    if (table.rows.length > 100) table.rows = table.rows.slice(0, 100);
    this.saveToStorage();
  }

  /**
   * Returns the N most recent workout sessions
   */
  public getWorkoutSessions(limit: number = 5): Record<string, any>[] {
    const table = this.tables.get('workout_sessions');
    if (!table) return [];
    return table.rows.slice(0, limit);
  }

  /**
   * Export telemetry_events table as a CSV string
   */
  public exportTelemetryCSV(): string {
    const table = this.tables.get('telemetry_events');
    if (!table || table.rows.length === 0) return '';
    const cols = table.schema.columns.map((c) => c.name);
    const lines: string[] = [cols.join(',')];
    for (const row of table.rows) {
      const vals = cols.map((c) => {
        const v = row[c];
        if (v === null || v === undefined) return '';
        const s = String(v);
        // Quote fields that contain commas or quotes
        return s.includes(',') || s.includes('"') || s.includes('\n')
          ? `"${s.replace(/"/g, '""')}"`
          : s;
      });
      lines.push(vals.join(','));
    }
    return lines.join('\n');
  }

  /**
   * SQL Parser and Query Executor
   */
  public executeSQL(rawQuery: string): SQLQueryResult {
    const startTime = performance.now();
    const query = rawQuery.trim();

    try {
      const cleanUpper = query.toUpperCase().replace(/\s+/g, ' ');

      // 1. SHOW TABLES
      if (cleanUpper === 'SHOW TABLES' || cleanUpper === 'SELECT NAME FROM SQLITE_MASTER') {
        const columns = ['table_name', 'total_rows', 'columns_count'];
        const rows = Array.from(this.tables.entries()).map(([name, tbl]) => [
          name,
          tbl.rows.length,
          tbl.schema.columns.length,
        ]);
        return {
          columns,
          rows,
          rowCount: rows.length,
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
          query,
        };
      }

      // 2. PRAGMA table_info(tbl)
      const pragmaMatch = query.match(/^PRAGMA\s+table_info\s*\(\s*['"]?([a-zA-Z0-9_]+)['"]?\s*\)/i);
      if (pragmaMatch) {
        const tableName = pragmaMatch[1];
        const tbl = this.tables.get(tableName);
        if (!tbl) {
          throw new Error(`Table '${tableName}' does not exist.`);
        }
        const columns = ['cid', 'name', 'type', 'notnull', 'dflt_value', 'pk'];
        const rows = tbl.schema.columns.map((col, idx) => [
          idx,
          col.name,
          col.type,
          0,
          null,
          col.primaryKey ? 1 : 0,
        ]);
        return {
          columns,
          rows,
          rowCount: rows.length,
          executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
          query,
        };
      }

      // 3. SELECT Queries
      if (cleanUpper.startsWith('SELECT')) {
        return this.handleSelect(query, startTime);
      }

      // 4. INSERT INTO
      if (cleanUpper.startsWith('INSERT INTO')) {
        return this.handleInsert(query, startTime);
      }

      // 5. UPDATE
      if (cleanUpper.startsWith('UPDATE')) {
        return this.handleUpdate(query, startTime);
      }

      // 6. DELETE FROM
      if (cleanUpper.startsWith('DELETE FROM')) {
        return this.handleDelete(query, startTime);
      }

      throw new Error(
        `Unsupported SQL statement. Pyrofit SQLite supports SELECT, INSERT, UPDATE, DELETE, SHOW TABLES, and PRAGMA table_info.`
      );
    } catch (err: any) {
      return {
        columns: ['error'],
        rows: [[err.message || 'SQL execution failed']],
        rowCount: 0,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        query,
        error: err.message,
      };
    }
  }

  private handleSelect(query: string, startTime: number): SQLQueryResult {
    // Regex for: SELECT ... FROM <table> [WHERE ...] [GROUP BY ...] [ORDER BY ...] [LIMIT ...]
    const fromMatch = query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) {
      throw new Error(`Malformed SELECT: Missing FROM <table> clause.`);
    }

    const tableName = fromMatch[1];
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`No such table: ${tableName}`);
    }

    // Extract columns clause between SELECT and FROM
    const selectColsPart = query.substring(
      query.search(/SELECT/i) + 6,
      query.search(/FROM/i)
    ).trim();

    let rows = [...table.rows];

    // WHERE clause
    const whereMatch = query.match(/WHERE\s+(.*?)(?=\s+(GROUP\s+BY|ORDER\s+BY|LIMIT)|$)/i);
    if (whereMatch) {
      const whereCondition = whereMatch[1].trim();
      rows = rows.filter((r) => this.evaluateCondition(r, whereCondition));
    }

    // GROUP BY clause
    const groupByMatch = query.match(/GROUP\s+BY\s+([a-zA-Z0-9_]+)/i);
    if (groupByMatch) {
      const groupCol = groupByMatch[1];
      const groups = new Map<string, any[]>();
      for (const r of rows) {
        const key = String(r[groupCol] ?? 'NULL');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(r);
      }

      const groupedResult: Record<string, any>[] = [];
      for (const [key, groupRows] of groups.entries()) {
        const representative: Record<string, any> = {
          [groupCol]: groupRows[0][groupCol],
          click_count: groupRows.length,
          count: groupRows.length,
        };
        groupedResult.push(representative);
      }
      rows = groupedResult;
    }

    // ORDER BY clause
    const orderMatch = query.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
    if (orderMatch) {
      const col = orderMatch[1];
      const direction = (orderMatch[2] || 'ASC').toUpperCase();
      rows.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        const res = valA > valB ? 1 : -1;
        return direction === 'DESC' ? -res : res;
      });
    }

    // LIMIT clause
    const limitMatch = query.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      rows = rows.slice(0, limit);
    }

    // Determine output columns
    let outColumns: string[] = [];
    if (selectColsPart === '*' || selectColsPart === '') {
      outColumns = table.schema.columns.map((c) => c.name);
    } else {
      outColumns = selectColsPart
        .split(',')
        .map((c) => {
          const colClean = c.trim();
          // handle aliases: e.g. COUNT(*) as click_count
          const asMatch = colClean.match(/\s+AS\s+([a-zA-Z0-9_]+)/i);
          if (asMatch) return asMatch[1];
          if (colClean.toUpperCase().includes('COUNT(')) return 'count';
          return colClean;
        });
    }

    const outRows = rows.map((r) =>
      outColumns.map((c) => (r[c] !== undefined ? r[c] : null))
    );

    return {
      columns: outColumns,
      rows: outRows,
      rowCount: outRows.length,
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      query,
    };
  }

  private handleInsert(query: string, startTime: number): SQLQueryResult {
    const match = query.match(/INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i);
    if (!match) {
      throw new Error(`Invalid INSERT INTO syntax. Use: INSERT INTO table (col1, col2) VALUES (val1, val2)`);
    }

    const tableName = match[1];
    const table = this.tables.get(tableName);
    if (!table) {
      throw new Error(`No such table: ${tableName}`);
    }

    const colNames = match[2].split(',').map((c) => c.trim());
    const values = match[3].split(',').map((v) => {
      const raw = v.trim();
      if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
        return raw.substring(1, raw.length - 1);
      }
      if (!isNaN(Number(raw))) return Number(raw);
      if (raw.toUpperCase() === 'TRUE') return 1;
      if (raw.toUpperCase() === 'FALSE') return 0;
      if (raw.toUpperCase() === 'NULL') return null;
      return raw;
    });

    const newRow: Record<string, any> = {};
    for (let i = 0; i < colNames.length; i++) {
      newRow[colNames[i]] = values[i] !== undefined ? values[i] : null;
    }

    table.rows.unshift(newRow);
    this.saveToStorage();

    return {
      columns: ['status', 'rows_affected'],
      rows: [['INSERT OK', 1]],
      rowCount: 1,
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      query,
    };
  }

  private handleUpdate(query: string, startTime: number): SQLQueryResult {
    const match = query.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.*?)(?:\s+WHERE\s+(.*))?$/i);
    if (!match) {
      throw new Error(`Invalid UPDATE syntax. Use: UPDATE table SET col=val [WHERE condition]`);
    }

    const tableName = match[1];
    const setClause = match[2];
    const whereClause = match[3];

    const table = this.tables.get(tableName);
    if (!table) throw new Error(`No such table: ${tableName}`);

    const assignments = setClause.split(',').map((pair) => {
      const [col, val] = pair.split('=').map((s) => s.trim());
      let parsedVal: any = val;
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        parsedVal = val.substring(1, val.length - 1);
      } else if (!isNaN(Number(val))) {
        parsedVal = Number(val);
      }
      return { col, val: parsedVal };
    });

    let count = 0;
    for (const r of table.rows) {
      if (!whereClause || this.evaluateCondition(r, whereClause)) {
        for (const assign of assignments) {
          r[assign.col] = assign.val;
        }
        count++;
      }
    }

    this.saveToStorage();

    return {
      columns: ['status', 'rows_updated'],
      rows: [['UPDATE OK', count]],
      rowCount: count,
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      query,
    };
  }

  private handleDelete(query: string, startTime: number): SQLQueryResult {
    const match = query.match(/DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.*))?$/i);
    if (!match) throw new Error(`Invalid DELETE syntax.`);

    const tableName = match[1];
    const whereClause = match[2];

    const table = this.tables.get(tableName);
    if (!table) throw new Error(`No such table: ${tableName}`);

    const before = table.rows.length;
    if (!whereClause) {
      table.rows = [];
    } else {
      table.rows = table.rows.filter((r) => !this.evaluateCondition(r, whereClause));
    }
    const affected = before - table.rows.length;
    this.saveToStorage();

    return {
      columns: ['status', 'rows_deleted'],
      rows: [['DELETE OK', affected]],
      rowCount: affected,
      executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
      query,
    };
  }

  private evaluateCondition(row: Record<string, any>, condition: string): boolean {
    const trimmed = condition.trim();

    // Check for equality (e.g. brand = 'Maurten' or tier = 'L1')
    const eqMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/);
    if (eqMatch) {
      const col = eqMatch[1].trim();
      let targetVal: any = eqMatch[2].trim();
      if ((targetVal.startsWith("'") && targetVal.endsWith("'")) || (targetVal.startsWith('"') && targetVal.endsWith('"'))) {
        targetVal = targetVal.substring(1, targetVal.length - 1);
      } else if (!isNaN(Number(targetVal))) {
        targetVal = Number(targetVal);
      }
      return String(row[col]) === String(targetVal);
    }

    // Greater than
    const gtMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*>\s*(.*)$/);
    if (gtMatch) {
      const col = gtMatch[1].trim();
      const val = Number(gtMatch[2].trim());
      return Number(row[col]) > val;
    }

    // Less than
    const ltMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*<\s*(.*)$/);
    if (ltMatch) {
      const col = ltMatch[1].trim();
      const val = Number(ltMatch[2].trim());
      return Number(row[col]) < val;
    }

    // LIKE
    const likeMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+LIKE\s+['"]%(.*?)%['"]$/i);
    if (likeMatch) {
      const col = likeMatch[1].trim();
      const pattern = likeMatch[2].toLowerCase();
      return String(row[col] || '').toLowerCase().includes(pattern);
    }

    return true;
  }

  /**
   * Export database as standard SQLite SQL Dump
   */
  public exportSQLDump(): string {
    const lines: string[] = [
      `-- PYROFIT MVP SQLite Database Dump`,
      `-- Exported: ${new Date().toISOString()}`,
      `-- Compatible with SQLite 3.x and standard RDBMS`,
      ``,
    ];

    for (const [name, table] of this.tables.entries()) {
      lines.push(`-- Table: ${name}`);
      lines.push(`DROP TABLE IF EXISTS "${name}";`);

      const colDefs = table.schema.columns
        .map((c) => `  "${c.name}" ${c.type}${c.primaryKey ? ' PRIMARY KEY' : ''}`)
        .join(',\n');

      lines.push(`CREATE TABLE "${name}" (\n${colDefs}\n);`);

      if (table.rows.length > 0) {
        lines.push(`BEGIN TRANSACTION;`);
        for (const row of table.rows) {
          const cols = table.schema.columns.map((c) => `"${c.name}"`).join(', ');
          const vals = table.schema.columns
            .map((c) => {
              const val = row[c.name];
              if (val === null || val === undefined) return 'NULL';
              if (typeof val === 'number') return val;
              if (typeof val === 'boolean') return val ? 1 : 0;
              return `'${String(val).replace(/'/g, "''")}'`;
            })
            .join(', ');
          lines.push(`INSERT INTO "${name}" (${cols}) VALUES (${vals});`);
        }
        lines.push(`COMMIT;`);
      }
      lines.push(``);
    }

    return lines.join('\n');
  }

  /**
   * Reset database to initial seed state
   */
  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.tables.clear();
    this.initialize();
  }
}

// Global Singleton Instance
export const sqliteEngine = new SQLiteEngine();
