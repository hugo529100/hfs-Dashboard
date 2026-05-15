exports.version = 1.0
exports.apiRequired = 8.87
exports.description = "Admin dashboard page. Access via http://your-ip/dashboard or /dashboard.html (admin login required)."
exports.repo = "Hug3O/Dashboard"
const fs = require('fs')
const path = require('path')

exports.init = api => ({
    async middleware(ctx) {
        // 同时支持 /dashboard 和 /dashboard.html
        if (ctx.path !== '/dashboard' && ctx.path !== '/dashboard.html')
            return

        const username = api.getCurrentUsername(ctx)
        const account = username && api.getAccount(username)

        // 必须 admin 登录
        if (!account?.admin) {
            ctx.state.serveApp = true
            return ctx.stop?.() || true
        }

        try {
            const file = path.join(__dirname, 'dashboard.html')

            ctx.type = 'text/html'
            ctx.body = fs.readFileSync(file, 'utf8')
            ctx.status = 200
        }
        catch (err) {
            api.log(err)
            ctx.status = 500
            ctx.body = 'dashboard.html not found'
        }

        return ctx.stop?.() || true
    }
})