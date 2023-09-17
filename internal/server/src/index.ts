import { server } from "./server"

async function start() {
    server.listen(3000, () => {
        console.log('Server started here')
    })
}

start().catch((e) => console.error(e))