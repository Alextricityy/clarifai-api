const express = require('express');

const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req,res) => {
	res.send('test');
})

app.post('/signin', (req, res) => {
	db.select('email', 'hash').from('login')
	.where('email', '=', req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('unable to get user'))
		} else {
			res.status(400).json('wrong credentials')
		}
	})
	.catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(compare => {
		compare.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return compare('users')
			.returning('*')
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(compare.commit)
		.catch(compare.rollback)
	})
	.catch(err => res.status(400).json('unable to register'))
})

app.get('/user/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
	.then(user => {
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('Not found')
		}
	})
	.catch(err => res.status(400).json('error getting user'))
})

app.post('/image', (req,res) => {

})

app.listen(3000, () => {
	console.log('server started on port 3000');
})