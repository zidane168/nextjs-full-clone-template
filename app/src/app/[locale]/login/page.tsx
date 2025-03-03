'use client';

import { getUserProfile, signIn } from '@/redux/features/auth/reducer';
import { useAppDispatch } from '@/redux/hooks';
import { ILoginRequest } from '@/types/common';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PasswordIcon from '@mui/icons-material/Password';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoadingButton from '@mui/lab/LoadingButton';
import {
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkRequestSuccess } from '@/utils/helpers/axios';
import useStyles from './login.styles';

const Login = () => {
    const { classes } = useStyles();
    const router = useRouter();
    const query = useSearchParams();
    const t = useTranslations('loginPage');

    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState } = useForm<ILoginRequest>();
    const { errors, isSubmitting } = formState;
    const dispatch = useAppDispatch();

    const onSubmit = async (data: ILoginRequest) => {
        const res = await dispatch(signIn(data));
        if (checkRequestSuccess(res.payload)) {
            await dispatch(getUserProfile());
            const redirectUrl = query.get('redirectUrl');
            router.push(redirectUrl ?? '/');
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    return (
        <div className={classes.auth}>
            <div className={classes.main}>
                <Grid container spacing={2} columns={12}>
                    <Grid item xs={12} lg={5}>
                        <div className={classes.authLeft}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                                className={classes.formContainer}
                            >
                                <Stack
                                    direction="column"
                                    alignItems="left"
                                    justifyContent="center"
                                    sx={{ width: '100%' }}
                                >
                                    <h1 className={classes.authTitle}>
                                        {t('login')}
                                    </h1>
                                    <TextField
                                        sx={{
                                            input: {
                                                color: 'inputText.main',
                                            },
                                            margin: '5px 0px',
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircleIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        type="search"
                                        label={t('email')}
                                        {...register('email', {
                                            required: 'Email is required',
                                        })}
                                        error={!!errors.email}
                                        helperText={
                                            errors.email?.message || ' '
                                        }
                                    />
                                    <TextField
                                        sx={{
                                            input: {
                                                color: 'inputText.main',
                                            },
                                            margin: '5px 0px',
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PasswordIcon />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleClickShowPassword
                                                        }
                                                        onMouseDown={
                                                            handleMouseDownPassword
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        label={t('password')}
                                        {...register('password', {
                                            required: 'Password is required',
                                        })}
                                        error={!!errors.password}
                                        helperText={
                                            errors.password?.message || ' '
                                        }
                                    />
                                    <LoadingButton
                                        size="large"
                                        variant="contained"
                                        loading={isSubmitting}
                                        disabled={isSubmitting}
                                        type="submit"
                                    >
                                        {t('login')}
                                    </LoadingButton>
                                </Stack>
                            </form>
                        </div>
                    </Grid>
                    <Grid
                        item
                        sm={0}
                        lg={7}
                        className={classes.authRight}
                    ></Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Login;
