const sqlite3 = require("sqlite3").verbose();
const parseType = require("../helpers/parseType.js");

const _createTables = Symbol("deployEvents");

class Database {
	constructor(databasePath, client) {
		this.db = new sqlite3.Database(databasePath, (err) => {
			if (err) {
				console.error("Error on opening database:", err.message);
			} else {
				console.log("Database connected!");
				this[_createTables]();
			}
		});
		this.client = client;
	}

	[_createTables]() {
		this.db.run(`CREATE TABLE IF NOT EXISTS userGlobalTable (
			id TEXT NOT NULL,
			variableName TEXT NOT NULL,
			value TEXT
		)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS userGuildTable (
			id TEXT NOT NULL,
			guildId TEXT NOT NULL,
			variableName TEXT NOT NULL,
			value TEXT
		)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS guildTable (
			guildId TEXT NOT NULL,
			variableName TEXT NOT NULL,
			value TEXT
		)`);

		this.db.run(`CREATE TABLE IF NOT EXISTS channelTable (
			channelId TEXT NOT NULL,
			variableName TEXT NOT NULL,
			value TEXT
		)`);
	}

	clearTables() {
		const tables = ["userGlobalTable", "userGuildTable", "guildTable", "channelTable"];
		for (const table of tables) {
			this.clearTable(table);
		}
	}

	async clearTable(tableName) {
		return new Promise((resolve, reject) => {
			this.db.run(`DELETE FROM ${tableName}`, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async getTableValue(table, options) {
		return new Promise(async (resolve, reject) => {
			let query = `SELECT * FROM ${table}`;
			if (options) {
				let conditions = Object.entries(options).map(([key, value]) => `${key} = "${value}"`);
				query += ` WHERE ${conditions.join(" AND ")}`;
			}

			this.db.get(query, async (err, row) => {
				if (err) {
					reject(err);
				} else {
					if (row) {
						resolve(row.value);
					} else {
						const { variableName, id, guildId } = options;
						if (Object.keys(this.client.variables).includes(variableName)) {
							await this.setTableValue(table, { ...options, value: this.client.variables[variableName]});
							setTimeout(async () => {
								const newValue = await this.getTableValue(table, options);
								resolve(newValue);
							}, 10);
						} else {
							resolve();
						}
					}
				}
			});
		});
	}

	async setTableValue(table, options) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM " + table + " WHERE " + Object.keys(options).filter(key => key !== "value").map(key => key + " = ?").join(" AND "), Object.values(options).filter((_, idx) => Object.keys(options)[idx] !== "value"), async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (Object.keys(this.client.variables).includes(options.variableName)) {
					if (typeof parseType(options.value) === this.client.variables[options.variableName].type || this.client.variables[options.variableName].type === "any") {
						if (!row) {
							const stmt = this.db.prepare("INSERT INTO " + table + " (" + Object.keys(options).join(", ") + ") VALUES (" + Object.values(options).map(() => "?").join(", ") + ")");
							stmt.run(Object.values(options), function (err) {
								if (err) {
									reject(err);
								} else {
									resolve("success");
								}
							});
							stmt.finalize();
						} else {
							const stmt = this.db.prepare("UPDATE " + table + " SET value = ? WHERE " + Object.keys(options).filter(key => key !== "value").map(key => key + " = ?").join(" AND "));
							stmt.run(Object.values(options), function (err) {
								if (err) {
									reject(err);
								} else {
									resolve("success");
								}
							});
							stmt.finalize();
						}
					} else {
						resolve("invalid-format");
					}
				} else {
					resolve("undefined");
				}
			});
		});
	}

	async resetTableValue(table, options) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM " + table + " WHERE " + Object.keys(options).map(key => key + " = ?").join(" AND "), Object.values(options), async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (row && Object.keys(this.client.variables).includes(options.variableName)) {
					const stmt = this.db.prepare("UPDATE " + table + " SET value = ? WHERE " + Object.keys(options).map(key => key + " = ?").join(" AND "));
					stmt.run([this.client.variables[options.variableName].value, ...Object.values(options) ], function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = Database;