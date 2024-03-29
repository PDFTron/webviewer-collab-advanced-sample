import React, { useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, Anchor } from 'grommet';
import { useHistory } from 'react-router-dom';
import { useClient } from '../context/client';
import { useUser } from '../context/user';
export default () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const client = useClient();
  const { setUser } = useUser();
  const history = useHistory();

  const submit = async (event) => {
    const { value } = event;
    if (value.password !== value.password2) {
      setErrors({ password2: 'Passwords do not match' });
    }
    setErrors({});

    const resp = await fetch(`${process.env.AUTH_URL}/signup`, {
      method: 'post',
      body: JSON.stringify({
        username: value.email,
        password: value.password,
        email: value.email,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (resp.status === 200) {
      const json = await resp.json();
      const user = await client.loginWithToken(json.token);
      setUser(user);
      history.push('/view?n=1');
    } else {
      setErrors({
        password2: 'There was an issue creating your account :(',
      });
    }
  };

  return (
    <div className="SignUp">
      <Box align="center" justify="center" height="100%">
        <Box
          direction="column"
          elevation="small"
          pad="small"
          width="medium"
          align="center"
          round="small"
        >
          <Heading level="2" margin="none" color="light">
            Sign up
          </Heading>

          <Form onSubmit={submit} style={{ marginTop: '10px' }}>
            <FormField htmlFor="email" label="email">
              <TextInput id="email" name="email" placeholder="email@address.com" />
            </FormField>

            <FormField htmlFor="password" label="password">
              <TextInput id="password" name="password" type="password" />
            </FormField>

            <FormField htmlFor="password2" label="confirm password" error={errors.password2}>
              <TextInput id="password2" name="password2" type="password" />
            </FormField>

            <Box align="center" style={{ marginTop: '30px' }}>
              <Button primary type="submit" label="submit" />
            </Box>
          </Form>
        </Box>

        <Anchor href="/" size="small" margin={{ top: 'small' }}>
          Have an account?
        </Anchor>
      </Box>
    </div>
  );
};
