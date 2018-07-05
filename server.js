const express = require('express');

const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req,res) => {
	res.send('test');
})

app.get('/user/:id' , (req,res) => {
	const {id} = req.params;
	let userFound = false;
	db.users.forEach(user => {
		if(user.id === id){
			userFound = true;
			return res.json(user);
		}
	})
	if(!userFound){
		res.status(404).json('no user found')
	}
})

app.post('/image', (req,res) => {

})

app.listen(3000, () => {
	console.log('server started on port 3000');
})