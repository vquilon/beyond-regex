from http.server import HTTPServer, SimpleHTTPRequestHandler
import re
import json
import time

PORT = 8000
server = None

class CustomHandler(SimpleHTTPRequestHandler):
	def do_GET(self):
		if re.search('/api/global_regex', self.path):
			print(self.path.split('/'))
			#This URL will trigger our sample function and send what it returns back to the browser
			self.send_response(200)
			self.send_header('Content-type','application/json; charset=UTF-8')
			self.end_headers()
			f = open("api/global_regex.json", "r")
			# all_regex = json.loads(f.read())
			self.wfile.write(f.read().encode()) # call sample function here
			return

			if re.search('/api/regex/.*', self.path):
				token = self.path.split('/')[-1]
			#This URL will trigger our sample function and send what it returns back to the browser
			self.send_response(200)
			self.send_header('Content-type','application/json; charset=UTF-8')
			self.end_headers()

			f = open("api/global_regex.json", "r")
			all_regex = json.loads(f.read())
			res_regex = [x for x in all_regex if x["token"] == token][0]

			self.wfile.write(json.dumps(res_regex).encode()) #call sample function here
			return

		# Path que redirecciona que carga el fichero index.html pero con los datos de pyramid_globals modificados
		if re.search('/api/r/.*', self.path):
			return
			# pyramid_globals = {
			# 	"regex": "Test",
			# 	"description": "No description",
			# 	"title": "Untitled Regex",
			# 	"strFlags": "",
			# 	"testString": "My test data",
			# 	"isOwner": true,
			# 	"token": "MpF1RYmqLxOyd2E0",
			# 	"tier": "",
			# 	"flavor": "javascript",
			# 	"unitTests": "[]",
			# 	"email": ""
			# }

		if re.search('/tools/off', self.path):
			self.send_response(200)
			self.send_header('Content-type','text/html; charset=UTF-8')
			self.end_headers()

			self.wfile.write("Bye!".encode())
			time.sleep(2)

			server.socket.close()
			quit()


		else:
			#serve files, and directory listings by following self.path from
			#current working directory
			try:
				SimpleHTTPRequestHandler.do_GET(self)
			except Exception as err:
				print(err)
				server.socket.close()
				quit()

	def do_POST(self):
		if re.search('/api/image', self.path):
			content_length = int(self.headers['Content-Length'])
			post_data = self.rfile.read(content_length)
			self.send_response(200)
			self.end_headers()
			response = BytesIO()
			response.write(b'This is POST request. ')
			response.write(b'Received: ')
			response.write(post_data)

			# req = {
			# 	"title":"Untitled Regex",
			# 	"description":"No description",
			# 	"regex":"My regular expression",
			# 	"flavor":"javascript",
			# 	"strFlags":"",
			# 	"testString":"My test data",
			# 	"unitTests":"[]"
			# }

			# Generar la imagen en la ruta /i/4XT2kVOAZ2BnfNJ9 osea el token, es donde se ha generado la imagen
			# AVERIGUAR COMO GENERA LA IMAGEN EN FORMATO PNG

			# DESPUES GUARDAR EN /r/data.json TODAS LAS REGEX ALMACENADAS CARGAR INDEX.HTML CON LOS DATOS DE ABAJO

			# res = {
			# "description": "No description",
			# "isOwner": true,
			# "flavor": "javascript",
			# "unitTests": "[]",
			# "regex": "My regular expression",
			# "name": null,
			# "title": "Untitled Regex",
			# "strFlags": "",
			# "testString": "My test data",
			# "token": "4XT2kVOAZ2BnfNJ9",
			# "version": 0
			# }

			self.wfile.write(response.getvalue())

		if re.search('/signup', self.path):
			users = json.loads(open("database/users.json", "r").read())

			f = open("database/users.json", "w")

			return

		if re.search('/login', self.path):
			users = json.loads(open("database/users.json", "r").read())
			# Cargar un fichero con los usuarios y listo, modifica el heml
			pass
			return

		if re.search('/logout', self.path):
			pass
			return


if __name__ == '__main__':
	try:
		server = HTTPServer(("localhost", PORT), CustomHandler)
		print("SERVING AT PORT", PORT)
		server.serve_forever()

	except KeyboardInterrupt:
		server.socket.close()