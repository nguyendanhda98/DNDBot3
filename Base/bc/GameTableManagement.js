module.exports = class GameTableManagement {
    gameTables = {}
    playersInTable = {}

    static getInstance() {
        if (!this.instance) {
            this.instance = new GameTableManagement()
        }

        return this.instance
    }

    constructor() {}

    getGameTable(host) {
        return this.gameTables[host.id]
    }

    getTableJoined(user) {
        return this.playersInTable[user.id]
    }

    addGameTable(host, gameTable) {
        this.gameTables[host.id] = gameTable
    }

    addPlayerInTable(user, host) {
        this.playersInTable[user.id] = this.gameTables[host.id]
    }

    removePlayerInTable(user) {
        delete this.playersInTable[user.id]
    }

    removeTable(host) {
        delete this.gameTables[host.id]
    }

    listTable() {
        const tables = []
        for (const key in this.gameTables) {
            const gameTable = [this.gameTables[key]]
            const { host, players, maxPlayer, gameStatus } = gameTable
            const table = {
                host: { id: host.id, username: host.username },
                maxPlayer,
                currentPlayer: players.length,
                gameStatus,
            }

            table.push(table)
        }

        return tables
    }
}
