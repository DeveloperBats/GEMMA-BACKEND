import "dotenv/config"
import Console from "./utils/logger"
import app from "./app"

const console = new Console("SERVER")

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.success(`Server running on port ${PORT}...`, 200)
})
