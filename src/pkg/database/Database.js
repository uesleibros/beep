const sqlite3 = require("sqlite3").verbose();

const _createTables = Symbol("deployEvents");

class Database {
	constructor(databasePath) {
		this.db = new sqlite3.Database(databasePath, (err) => {
			if (err) {
				console.error("Error on opening database:", err.message);
			} else {
				console.log("Database connected!");
				this[_createTables]();
			}
		});
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
					console.error(`Error clearing table ${tableName}:`, err.message);
					reject(err);
				} else {
					console.log(`Cleared table ${tableName}`);
					resolve();
				}
			});
		});
	}

	async getGlobalUserVar(variableName, id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM userGlobalTable WHERE id = ? AND variableName = ?", [id, variableName], (err, row) => {
				console.log(row)
				if (err) {
					console.error("Error fetching data from userGlobalTable:", err.message);
					reject(err);
				} else {
					if (row) {
						console.log(`Retrieved value from userGlobalTable: id=${id}, variableName=${variableName}, value=${row.value}`);
						resolve(row.value);
					} else {
						console.log(`No data found in userGlobalTable for id=${id} and variableName=${variableName}`);
						resolve(null);
					}
				}
			});
		});
	}

	async setGlobalUserVar(variableName, value, id) {
		return new Promise((resolve, reject) => {
			const stmt = this.db.prepare("INSERT INTO userGlobalTable (id, variableName, value) VALUES (?, ?, ?)");
			stmt.run(id, variableName, value, function (err) {
				if (err) {
					console.error("Error inserting data into userGlobalTable:", err.message);
					reject(err);
				} else {
					console.log(`Inserted into userGlobalTable: id=${id}, variableName=${variableName}, value=${value}`);
					resolve();
				}
			});
			stmt.finalize();
		});
	}

	async removeGlobalUserVar(variableName, id) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM userGlobalTable WHERE id = ? AND variableName = ?", [id, variableName], function (err) {
				if (err) {
					console.error("Error removing data from userGlobalTable:", err.message);
					reject(err);
				} else {
					console.log(`Removed from userGlobalTable: id=${id}, variableName=${variableName}`);
					resolve();
				}
			});
		});
	}

	async getUserGuildVar(variableName, guildId, id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM userGuildTable WHERE id = ? AND guildId = ? AND variableName = ?", [id, guildId, variableName], (err, row) => {
				if (err) {
					console.error("Error fetching data from userGuildTable:", err.message);
					reject(err);
				} else {
					if (row) {
						console.log(`Retrieved value from userGuildTable: id=${id}, variableName=${variableName}, value=${row.value}`);
						resolve(row.value);
					} else {
						console.log(`No data found in userGuildTable for id=${id} and variableName=${variableName}`);
						resolve(null);
					}
				}
			});
		});
	}

	async setUserGuildVar(variableName, value, guildId, id) {
		return new Promise((resolve, reject) => {
			const stmt = this.db.prepare("INSERT INTO userGuildTable (id, guildId, variableName, value) VALUES (?, ?, ?, ?)");
			stmt.run(id, guildId, variableName, value, function (err) {
				if (err) {
					console.error("Error inserting data into userGuildTable:", err.message);
					reject(err);
				} else {
					console.log(`Inserted into userGuildTable: id=${id}, variableName=${variableName}, value=${value}`);
					resolve();
				}
			});
			stmt.finalize();
		});
	}

	async removeUserGuildVar(variableName, guildId, id) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM userGuildTable WHERE id = ? AND guildId = ? AND variableName = ?", [id, guildId, variableName], function (err) {
				if (err) {
					console.error("Error removing data from userGuildTable:", err.message);
					reject(err);
				} else {
					console.log(`Removed from userGuildTable: id=${id}, variableName=${variableName}`);
					resolve();
				}
			});
		});
	}

	async getChannelVar(variableName, channelId) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM channelTable WHERE channelId = ? AND variableName = ?", [channelId, variableName], (err, row) => {
				if (err) {
					console.error("Error fetching data from channelTable:", err.message);
					reject(err);
				} else {
					if (row) {
						console.log(`Retrieved value from channelTable: channelId=${channelId}, variableName=${variableName}, value=${row.value}`);
						resolve(row.value);
					} else {
						console.log(`No data found in channelTable for channelId=${channelId} and variableName=${variableName}`);
						resolve(null);
					}
				}
			});
		});
	}

	async setChannelVar(variableName, value, channelId) {
		return new Promise((resolve, reject) => {
			const stmt = this.db.prepare("INSERT INTO channelTable (channelId, variableName, value) VALUES (?, ?, ?)");
			stmt.run(channelId, variableName, value, function (err) {
				if (err) {
					console.error("Error inserting data into channelTable:", err.message);
					reject(err);
				} else {
					console.log(`Inserted into channelTable: id=${channelId}, variableName=${variableName}, value=${value}`);
					resolve();
				}
			});
			stmt.finalize();
		});
	}

	async removeChannelVar(variableName, channelId) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM channelTable WHERE channelId = ? AND variableName = ?", [channelId, variableName], function (err) {
				if (err) {
					console.error("Error removing data from channelTable:", err.message);
					reject(err);
				} else {
					console.log(`Removed from channelTable: channelId=${channelId}, variableName=${variableName}`);
					resolve();
				}
			});
		});
	}

	async getGuildVar(variableName, guildId) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM guildTable WHERE guildId = ? AND variableName = ?", [guildId, variableName], (err, row) => {
				if (err) {
					console.error("Error fetching data from guildTable:", err.message);
					reject(err);
				} else {
					if (row) {
						console.log(`Retrieved value from guildTable: guildId=${guildId}, variableName=${variableName}, value=${row.value}`);
						resolve(row.value);
					} else {
						console.log(`No data found in guildTable for guildId=${guildId} and variableName=${variableName}`);
						resolve(null);
					}
				}
			});
		});
	}

	async setGuildVar(variableName, value, guildId) {
		return new Promise((resolve, reject) => {
			const stmt = this.db.prepare("INSERT INTO guildTable (guildId, variableName, value) VALUES (?, ?, ?)");
			stmt.run(guildId, variableName, value, function (err) {
				if (err) {
					console.error("Error inserting data into guildTable:", err.message);
					reject(err);
				} else {
					console.log(`Inserted into guildTable: id=${guildId}, variableName=${variableName}, value=${value}`);
					resolve();
				}
			});
			stmt.finalize();
		});
	}

	async removeGuildVar(variableName, guildId) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM guildTable WHERE guildId = ? AND variableName = ?", [guildId, variableName], function (err) {
				if (err) {
					console.error("Error removing data from guildTable:", err.message);
					reject(err);
				} else {
					console.log(`Removed from channelTable: guildId=${guildId}, variableName=${variableName}`);
					resolve();
				}
			});
		});
	}
}

module.exports = Database;