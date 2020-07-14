import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import Post from './components/Post';
import './App.css';
import { db, auth, storage } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
}));

function App() {
	const classes = useStyles();
	const [modalStyles] = useState(getModalStyle);

	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);

	const [openSignIn, setopenSignIn] = useState('false');

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [user, setUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// user has logged In
				console.log(authUser);
				setUser(authUser);
				//No need of thi long format of doing the same || we can simplify the code
				// if (authUser.displayName) {
				// 	//don't update username
				// } else {
				// 	//if we just created someone
				// 	return authUser.updateProfile({
				// 		displayName: username
				// 	});
				// }
			} else {
				// user has logged Out
				setUser(null);
			}
		});

		return () => {
			//perform some cleanup actions
			unsubscribe();
		};
	}, [user, username]);

	// useEffect runs a piece of code based on a specific condition
	useEffect(() => {
		//this is where the code runs
		db.collection('posts').onSnapshot((snapshot) => {
			//every time a new post is added, this code fires.
			setPosts(
				snapshot.docs.map((doc) => ({
					//Getting posts by id to enable faster reload on refresh
					id: doc.id,
					post: doc.data()
				}))
			);
		});
	}, []);

	const signUp = (event) => {
		event.preventDefault();

		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username
				});
			})
			.catch((error) => alert(error.message));
	};

	return (
		<div className='App'>
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyles} className={classes.paper}>
					<form className='app__signup'>
						<center>
							<img
								className='app__headerImage'
								src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
								alt=''
							/>
						</center>
						<Input
							placeholder='username'
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<Input
							placeholder='email'
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder='password'
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Button type='submit' onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>
			<div className='app__header'>
				<img
					className='app__headerImage'
					src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
					alt=''
				/>
			</div>
			{/* sign-up/Logout display button fuctionality */}

			{user ? (
				<Button onClick={() => auth.signOut()}> Logout</Button>
			) : (
				<Button onClick={() => setOpen(true)}>Sign Up</Button>
			)}
			<h1>Hello Hosea Lets build an Instagram Clone React </h1>
			{posts.map(({ id, post }) => (
				<Post
					key={id}
					username={post.username}
					caption={post.caption}
					imageUrl={post.imageUrl}
				/>
			))}
		</div>
	);
}

export default App;
