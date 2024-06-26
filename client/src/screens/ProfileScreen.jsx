import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { userInfo } = useSelector((state) => state.auth);

	const [updateUser, { isLoading }] = useUpdateUserMutation();

	const submitHandler = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			toast.error("Password do not Match");
		} else {
			try {
				const res = await updateUser({
					_id: userInfo._id,
					name,
					email,
					password,
				}).unwrap();
				dispatch(setCredentials({ ...res }));
				toast.success("Profile Updated");
			} catch (err) {
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	useEffect(() => {
		setName(userInfo.name);
		setEmail(userInfo.email);
	}, [userInfo.setName, userInfo.setEmail]);

	return (
		<FormContainer>
			<h1>Update Profile</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group
					className='my-2'
					controlId='name'>
					<Form.Label>Name</Form.Label>
					<Form.Control
						type='name'
						placeholder='Enter name'
						value={name}
						autoComplete='name'
						onChange={(e) => setName(e.target.value)}></Form.Control>
				</Form.Group>

				<Form.Group
					className='my-2'
					controlId='email'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						autoComplete='email'
						onChange={(e) => setEmail(e.target.value)}></Form.Control>
				</Form.Group>

				<Form.Group
					className='my-2'
					controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						autoComplete='new-password'
						onChange={(e) => setPassword(e.target.value)}></Form.Control>
				</Form.Group>
				<Form.Group
					className='my-2'
					controlId='confirmPassword'>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Confirm password'
						value={confirmPassword}
						autoComplete='new-password'
						onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
				</Form.Group>

				{isLoading && <Loader />}

				<Button
					type='submit'
					disabled={isLoading}
					variant='primary'
					className='mt-3'>
					Update
				</Button>
			</Form>
		</FormContainer>
	);
};

export default ProfileScreen;
