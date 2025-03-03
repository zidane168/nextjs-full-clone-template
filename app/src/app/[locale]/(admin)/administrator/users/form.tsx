"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Box, Grid } from "@mui/material"
import { ACTIONS } from "@/utils/constants"
import { useForm } from "react-hook-form"
import { usePathname, useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { toast } from "react-toastify"
import { IUserCreateRequest, IUserFormData, IUserUpdateRequest } from "@/types/user"
import { createUser, updateUser } from "@/redux/features/user/reducer"
import { getRoles, selectIsLoadList, selectRoleOptions } from "@/redux/features/role/reducer"
import {
    InputField,
    FormActions,
    SelectField,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"

interface IUserForm {
    id?: string
    initialValue?: IUserFormData
    action: string
}

const UserForm = (props: IUserForm) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const roleOptions = useAppSelector(selectRoleOptions)
    const isLoadedList = useAppSelector(selectIsLoadList)
    const pathname = usePathname()
    const router = useRouter()
    const { id, initialValue, action } = props

    const requireMessage = t("validation.itemIsRequiredField")
    const validateEmail = t("validation.emailRegex")
    const validatePassword = t("validation.passwordRegex")
    const newPasswordMustDiffer = t("validation.newPasswordMustDiffer")
    const passwordMinLength = t("validation.passwordMinLength")
    const passwordMustMatch = t("validation.passwordMustMatch")

    const UserSchema = yup
        .object()
        .shape(
            action === "edit"
                ? {
                      roleId: yup
                          .number()
                          .transform((value, originalValue) => {
                              return originalValue === "" ? null : value
                          })
                          .optional()
                          .nullable(),
                      name: yup.string().optional().nullable(),
                      phone: yup.string().optional().nullable(),
                      email: yup
                          .string()
                          .required(requireMessage)
                          .matches(/^\S+@\S+\.\S+$/, validateEmail),
                      oldPassword: yup.string().optional().nullable(),
                      newPassword: yup.string().when("oldPassword", {
                          is: (val: string) => val && val.length > 0,
                          then: schema =>
                              schema
                                  .notOneOf([yup.ref("oldPassword")], newPasswordMustDiffer)
                                  .min(8, passwordMinLength)
                                  .required(requireMessage)
                                  .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, validatePassword),
                          otherwise: schema => schema.optional().nullable(),
                      }),
                      isKitchen: yup.boolean().typeError(requireMessage).required(requireMessage),
                      enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
                  }
                : {
                      roleId: yup
                          .number()
                          .transform((value, originalValue) => {
                              return originalValue === "" ? null : value
                          })
                          .required(requireMessage),
                      name: yup.string().required(requireMessage),
                      phone: yup.string().required(requireMessage),
                      email: yup
                          .string()
                          .required(requireMessage)
                          .matches(/^\S+@\S+\.\S+$/, validateEmail),
                      password: yup
                          .string()
                          .min(8, passwordMinLength)
                          .required(requireMessage)
                          .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, validatePassword),
                      confirmPassword: yup
                          .string()
                          .oneOf([yup.ref("password"), undefined], passwordMustMatch)
                          .required(requireMessage),
                      isKitchen: yup.boolean().typeError(requireMessage).required(requireMessage),
                      enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
                  },
        )
        .required()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(UserSchema),
        defaultValues: {
            isKitchen: false,
            enabled: true,
        },
    })

    const onSubmit = async (data: IUserFormData) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        const {
            email,
            name,
            phone,
            password,
            roleId,
            oldPassword,
            newPassword,
            isKitchen,
            enabled,
        } = data
        if (action === ACTIONS.create) {
            const createData = {
                email,
                name,
                phone,
                password,
                roleId,
                isKitchen,
                enabled,
            } as IUserCreateRequest

            const value = await dispatch(createUser(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const updateFields = {
                email,
                name,
                phone,
                roleId,
                oldPassword,
                newPassword,
                isKitchen,
                enabled,
            } as IUserUpdateRequest
            const updateFieldsWithoutEmpty = Object.entries(updateFields).reduce(
                (acc, [key, value]) => {
                    if (key === "enabled") {
                        return { ...acc, [key]: value }
                    }
                    return value === "" || !value ? acc : { ...acc, [key]: value }
                },
                {},
            )
            const updateData = { ...updateFieldsWithoutEmpty, id } as IUserUpdateRequest
            const value = await dispatch(updateUser(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    const fetchRoles = async () => {
        await dispatch(getRoles())
    }

    useEffect(() => {
        if (!isLoadedList) fetchRoles()
    }, [isLoadedList])

    useEffect(() => {
        if (initialValue) {
            reset(initialValue)
        }
    }, [initialValue])

    return (
        <div>
            <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                marginBottom: "10px",
                            }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <SelectField
                                        control={control}
                                        defaultValue={""}
                                        name="roleId"
                                        label={t("user.role")}
                                        options={roleOptions}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField
                                        name="name"
                                        control={control}
                                        label={t(`common.name`)}
                                        id="name"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <InputField
                                        name="email"
                                        control={control}
                                        label={t(`common.email`)}
                                        id="email"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField
                                        name="phone"
                                        control={control}
                                        label={t(`common.phone`)}
                                        id="phone"
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <InputField
                                        name={action === "edit" ? "oldPassword" : "password"}
                                        control={control}
                                        label={
                                            action === "edit"
                                                ? t(`user.oldPassword`)
                                                : t(`user.password`)
                                        }
                                        type="password"
                                        id={action === "edit" ? "oldPassword" : "password"}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField
                                        name={action === "edit" ? "newPassword" : "confirmPassword"}
                                        control={control}
                                        label={
                                            action === "edit"
                                                ? t("user.newPassword")
                                                : t(`user.confirmPassword`)
                                        }
                                        type="password"
                                        id={action === "edit" ? "newPassword" : "confirmPassword"}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12}>
                                    <RadioGroupField
                                        name="enabled"
                                        control={control}
                                        label={t("common.isActive")}
                                        options={[
                                            { label: t("common.enabled"), value: true },
                                            {
                                                label: t("common.disabled"),
                                                value: false,
                                            },
                                        ]}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <RadioGroupField
                                        name="isKitchen"
                                        control={control}
                                        label={t("user.isKitchen")}
                                        options={[
                                            { label: t("common.true"), value: true },
                                            {
                                                label: t("common.false"),
                                                value: false,
                                            },
                                        ]}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <FormActions
                    backMainPage={() => backMainPage(pathname, action, router)}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    )
}

export default UserForm
