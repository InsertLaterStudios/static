/*
	
*/



// // ENVIROMENT // //
const STATIC_PORT = process.env.STATIC_PORT
if (!STATIC_PORT) console.log("ERROR static.js process.env.STATIC_PORT")



// // DEPENDENCIES // //
const { access, readFile } = require("fs")
const { createServer } = require("http")

const { web } = require("../aaJs/statusCodes.js")
const { parseUrl } = require("../aaJs/authorizationHandler.js")



// // CACHE // //
let cache = {}



// // SERVER // //
const server = createServer((req, res)=>{
	const path = parseUrl(req)
	if (path.length != 2) web.e414(res)
	else if (req.method == "GET") {
		if (path[0] == "static") {
			const ending = path[path.length-1].splie('.')
			if (ending.length == 2) {
				if (cache[path[1]]) res.writeHead(200, {"Content-Type":cache[path[1]].type}).end(cache[path[1]].data)
				else readFile(`./static/${path[1]}`, (err, data)=>{
					if (err) web.e404(res)
					else {
						if (ending[1] == "js") cache[path[1]] = {type:"text/javascript", data:data}
						else if (ending[1] == "css") cache[path[1]] = {type:"text/css", data:data}
						else return web.e404(res)
						
						res.writeHead(200, {"Content-Type":cache[path[1]].type}).end(cache[path[1]].data)
					}
				})
			}
			else web.e400(res)
		}	
		else web.e404(res)
	}
	else web.e405(res)
})
server.listen(STATIC_PORT, "localhost", () => {
    console.log(`server at http://localhost:${STATIC_PORT}`)
})

