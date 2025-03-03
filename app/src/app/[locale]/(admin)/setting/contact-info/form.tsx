"use client"

import { createContactInfo, updateContactInfo } from "@/redux/features/contactInfo/reducer"
import { useAppDispatch } from "@/redux/hooks"
import {
    IContactInfo,
    IContactInfoCreateRequest,
    IContactInfoUpdateRequest,
} from "@/types/contactInfo"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import {
    FormActions,
    InputField,
    MultiLanguages,
    RadioGroupField,
    UploadFileField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
interface IContactInfoForm {
    id?: string
    initialValue?: IContactInfo
    action: string
}

const ContactInfoForm = (props: IContactInfoForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")

    const LanguageValidation = yup
        .object()
        .shape({
            tc: yup.string().required(requireMessage),
            en: yup.string().required(requireMessage),
            sc: yup.string().required(requireMessage),
        })
        .required()

    const ItemSchema = yup
        .object()
        .shape({
            name: LanguageValidation,
            content: LanguageValidation,
            phone: yup.string().required(requireMessage),
            fax: yup.string().required(requireMessage),
            email: yup.string().required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
        {
            name: "content",
            type: MULTI_LANGUAGE_FIELD.RICHTEXT,
        },
    ]

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty, isValid },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })

    const onSubmit = async (data: IContactInfoCreateRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createContactInfo(data as IContactInfoCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(
                updateContactInfo({ ...data, id } as IContactInfoUpdateRequest),
            )
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }
    useEffect(() => {
        reset(initialValue)
    }, [initialValue])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MultiLanguages control={control} fields={multiLangFields} />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <UploadFileField
                                control={control}
                                name="coverImageId"
                                isNeedToCheckDimension
                                label={t("common.coverImage")}
                                canUploadVideo={false}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <InputField control={control} name="phone" label={t("common.phone")} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <InputField control={control} name="fax" label={t("common.fax")} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <InputField
                                control={control}
                                name="whatsapp"
                                label={t("common.whatsapp")}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <InputField control={control} name="email" label={t("common.email")} />
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
                    </Grid>
                </Grid>
            </Grid>
            <FormActions
                isValid={isValid}
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default ContactInfoForm
