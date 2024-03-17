const sqlite3 = require("sqlite3").verbose();

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

	async getGlobalUserVar(variableName, id) {
		return new Promise(async (resolve, reject) => {
			this.db.get("SELECT value FROM userGlobalTable WHERE id = ? AND variableName = ?", [id, variableName], async (err, row) => {
				if (err) {
					reject(err);
				} else {
					if (row) {
						resolve(row.value);
					} else {
						if (Object.keys(this.client.variables).includes(variableName)) {
							await this.setGlobalUserVar(variableName, this.client.variables[variableName], id);
							setTimeout(async () => {
								const newValue = await this.getGlobalUserVar(variableName, id);
								resolve(newValue);
							}, 10);
						} else {
							resolve(null);
						}
					}
				}
			});
		});
	}

	async setGlobalUserVar(variableName, value, id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM userGlobalTable WHERE id = ? AND variableName = ?", [id, variableName], async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (!row) {
					const stmt = this.db.prepare("INSERT INTO userGlobalTable (id, variableName, value) VALUES (?, ?, ?)");
					stmt.run(id, variableName, value, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				} else {
					const stmt = this.db.prepare("UPDATE userGlobalTable SET value = ? WHERE id = ? AND variableName = ?");
					stmt.run(value, id, variableName, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				}
			});
		});
	}

	async removeGlobalUserVar(variableName, id) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM userGlobalTable WHERE id = ? AND variableName = ?", [id, variableName], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async getUserGuildVar(variableName, guildId, id) {
		return new Promise(async (resolve, reject) => {
			this.db.get("SELECT value FROM userGuildTable WHERE id = ? AND guildId = ? AND variableName = ?", [id, guildId, variableName], async (err, row) => {
				if (err) {
					reject(err);
				} else {
					if (row) {
						resolve(row.value);
					} else {
						if (Object.keys(this.client.variables).includes(variableName)) {
							await this.setUserGuildVar(variableName, this.client.variables[variableName], guildId, id);
							setTimeout(async () => {
								const newValue = await this.getUserGuildVar(variableName, guildId, id);
								resolve(newValue);
							}, 10);
						} else {
							resolve(null);
						}
					}
				}
			});
		});
	}


	async setUserGuildVar(variableName, value, guildId, id) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM userGuildTable WHERE id = ? AND guildId = ? AND variableName = ?", [id, guildId, variableName], async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (!row) {
					const stmt = this.db.prepare("INSERT INTO userGuildTable (id, guildId, variableName, value) VALUES (?, ?, ?, ?)");
					stmt.run(id, guildId, variableName, value, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				} else {
					const stmt = this.db.prepare("UPDATE userGuildTable SET value = ? WHERE id = ? AND guildId = ? AND variableName = ?");
					stmt.run(value, id, guildId, variableName, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				}
			});
		});
	}


	async removeUserGuildVar(variableName, guildId, id) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM userGuildTable WHERE id = ? AND guildId = ? AND variableName = ?", [id, guildId, variableName], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async getChannelVar(variableName, channelId) {
		return new Promise(async (resolve, reject) => {
			this.db.get("SELECT value FROM channelTable WHERE variableName = ? AND channelId = ?", [variableName, channelId], async (err, row) => {
				if (err) {
					reject(err);
				} else {
					if (row) {
						resolve(row.value);
					} else {
						if (Object.keys(this.client.variables).includes(variableName)) {
							await this.setChannelVar(variableName, this.client.variables[variableName], channelId);
							setTimeout(async () => {
								const newValue = await this.getChannelVar(variableName, channelId);
								resolve(newValue);
							}, 10);
						} else {
							resolve(null);
						}
					}
				}
			});
		});
	}

	async setChannelVar(variableName, value, channelId) {
		return new Promise(async (resolve, reject) => {
			this.db.get("SELECT value FROM channelTable WHERE channelId = ? AND variableName = ?", [channelId, variableName], async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (!row) {
					const stmt = this.db.prepare("INSERT INTO channelTable (channelId, variableName, value) VALUES (?, ?, ?)");
					stmt.run(channelId, variableName, value, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				} else {
					const stmt = this.db.prepare("UPDATE channelTable SET value = ? WHERE channelId = ? AND variableName = ?");
					stmt.run(value, channelId, variableName, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				}
			});
		});
	}


	async removeChannelVar(variableName, channelId) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM channelTable WHERE channelId = ? AND variableName = ?", [channelId, variableName], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	async getGuildVar(variableName, guildId) {
		return new Promise((resolve, reject) => {
			this.db.get("SELECT value FROM guildTable WHERE guildId = ? AND variableName = ?", [guildId, variableName], (err, row) => {
				if (err) {
					reject(err);
				} else {
					if (row) {
						resolve(row.value);
					} else {
						resolve(null);
					}
				}
			});
		});
	}

	async setGuildVar(variableName, value, guildId) {
		return new Promise(async (resolve, reject) => {
			this.db.get("SELECT value FROM guildTable WHERE guildId = ? AND variableName = ?", [guildId, variableName], async (err, row) => {
				if (err) {
					reject(err);
					return;
				}

				if (!row) {
					const stmt = this.db.prepare("INSERT INTO guildTable (guildId, variableName, value) VALUES (?, ?, ?)");
					stmt.run(guildId, variableName, value, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				} else {
					const stmt = this.db.prepare("UPDATE guildTable SET value = ? WHERE guildId = ? AND variableName = ?");
					stmt.run(value, guildId, variableName, function (err) {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
					stmt.finalize();
				}
			});
		});
	}

	async removeGuildVar(variableName, guildId) {
		return new Promise((resolve, reject) => {
			this.db.run("DELETE FROM guildTable WHERE guildId = ? AND variableName = ?", [guildId, variableName], function (err) {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

module.exports = Database;