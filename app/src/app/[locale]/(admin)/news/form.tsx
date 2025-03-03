"use client"

import DatePickerField from "@/components/Form/DatePickerField"
import InputField from "@/components/Form/InputField"
import UploadFileField from "@/components/Form/UploadFileField"
import { createNews, updateNews } from "@/redux/features/news/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { INew, INewCreateRequest, INewUpdateRequest } from "@/types/news"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
interface INewForm {
    id?: string
    initialValue?: INew
    action: string
}

const NewsForm = (props: INewForm) => {
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
            eventDate: yup.string().required(requireMessage),
            published: yup.date().required(requireMessage),
            unpublished: yup.date().required(requireMessage),
            sort: yup.number().optional(),
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
    })

    const onSubmit = async (data: INewCreateRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createNews(data as INewCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(updateNews({ ...data, id } as INewUpdateRequest))
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
                    <Box
                        sx={{
                            padding: "10px",
                            border: "1px solid #ddd",
                            marginBottom: "10px",
                        }}>
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
                        <MultiLanguages control={control} fields={multiLangFields} />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="eventDate"
                                    label={t("new.eventDate")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <DatePickerField
                                    control={control}
                                    name="published"
                                    label={t("common.published")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <DatePickerField
                                    control={control}
                                    name="unpublished"
                                    label={t("common.unpublished")}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12}>
                                <UploadFileField
                                    name="contentImageId"
                                    control={control}
                                    label={t("common.thumbnail")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <UploadFileField
                                    name="thumbnailId"
                                    control={control}
                                    label={t("common.thumbnail")}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <InputField
                                    control={control}
                                    name="sort"
                                    label={t("common.sort")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
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

export default NewsForm
