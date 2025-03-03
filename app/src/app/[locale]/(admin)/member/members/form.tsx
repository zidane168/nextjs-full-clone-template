import { createMember, updateMember } from "@/redux/features/member/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { IMember, IMemberRequest, IMemberUpdate, ITitle } from "@/types/member"
import { ACTIONS, GENDER_OPTIONS } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import {
    DatePickerField,
    FormActions,
    InputField,
    SelectField,
    UploadFileField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"

interface IMemberForm {
    id?: string
    initValue?: IMember
    action: string
}

const MemberForm = (props: IMemberForm) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const { id, initValue, action } = props

    const requireMessage = t("validation.itemIsRequiredField")
    const itemCannotBeInFuture = t("validation.itemCannotBeInFuture")
    const itemIsInvalidType = t("validation.itemIsInvalidType")
    const validateEmail = t("validation.emailRegex")

    yup.addMethod(yup.mixed, "fileRequired", function (message) {
        return this.test("fileRequired", message, value => {
            if (value) return true
            return false
        })
    })

    const ItemSchema = yup
        .object()
        .shape({
            email: yup
                .string()
                .transform((value, originalValue) => (originalValue === "" ? null : value))
                .matches(/^\S+@\S+\.\S+$/, validateEmail)
                .optional()
                .nullable(),
            name: yup.string().required(requireMessage),
            gender: yup
                .string()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .typeError(requireMessage)
                .required(requireMessage),
            dob: yup
                .date()
                .test("is-future-year", itemCannotBeInFuture, value => {
                    if (value) {
                        return new Date(value) <= new Date()
                    }
                })
                .typeError(itemIsInvalidType)
                .required(requireMessage),
        })
        .required()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: initValue,
    })

    const onSubmit = async (data: IMemberRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        let { title, email, gender, name, dob, avatarId } = data
        const hasUpdatedAvatar = typeof avatarId !== "string"

        title = ITitle.MR
        if (gender === "FEMALE") {
            title = ITitle.MS
        }

        const createData: IMemberRequest = {
            title,
            email,
            gender,
            name,
            dob: new Date(dob).toISOString().slice(0, 10),
            avatarId,
        }

        if (action === ACTIONS.create) {
            const value = await dispatch(createMember(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const updateData = {
                title,
                email,
                gender,
                name,
                dob,
                ...(hasUpdatedAvatar && { avatarId }),
                id,
            } as IMemberUpdate

            const value = await dispatch(updateMember(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    useEffect(() => {
        if (!initValue) return
        const updatedInitValue = {
            ...initValue,
            avatarId: initValue.avatar && initValue.avatar,
        }
        reset(updatedInitValue)
    }, [initValue])

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
                                    <InputField
                                        name="email"
                                        required={true}
                                        control={control}
                                        label={t(`common.email`)}
                                        id="email"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField
                                        name="name"
                                        control={control}
                                        label={t(`member.name`)}
                                        id="name"
                                        required={true}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <DatePickerField
                                        control={control}
                                        name="dob"
                                        label={t("member.dob")}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <SelectField
                                        name="gender"
                                        control={control}
                                        required={true}
                                        label={t(`common.gender`)}
                                        options={GENDER_OPTIONS}
                                        defaultValue=""
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <UploadFileField
                                        control={control}
                                        name="avatarId"
                                        label={t("member.avatar")}
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

export default MemberForm
