"use client"

import { createFactCategory, updateFactCategory } from "@/redux/features/factCategory/reducer"
import { useAppDispatch } from "@/redux/hooks"
import { ISelectOption } from "@/types/common"
import {
    IFactCategory,
    IFactCategoryCreateRequest,
    IFactCategoryUpdateRequest,
    IFactCategoryFormData,
} from "@/types/factCategory"
import { ACTIONS, FACT_TYPE, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Grid } from "@mui/material"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"
import {
    MultiLanguages,
    FormActions,
    SelectField,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"

interface IFactCategoryForm {
    id?: string
    initialValue?: IFactCategory
    action: string
}

const FactCategoryForm = (props: IFactCategoryForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")

    const ItemSchema = yup
        .object()
        .shape({
            name: yup
                .object()
                .shape({
                    tc: yup.string().required(requireMessage),
                    en: yup.string().required(requireMessage),
                })
                .required(),
            factType: yup.string().typeError(requireMessage).required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
    ]

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
    })

    const onSubmit = async (data: IFactCategoryFormData) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        const { name, factType, enabled } = data
        const createData = {
            name,
            factType,
            enabled,
        } as IFactCategoryCreateRequest

        if (action === ACTIONS.create) {
            const value = await dispatch(createFactCategory(createData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const updateData = { ...createData, id } as IFactCategoryUpdateRequest
            const value = await dispatch(updateFactCategory(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    const getFactCategoryTypes = () => {
        return Object.entries(FACT_TYPE).map(([key, value]) => {
            return {
                label: t(`factCategory.${value}`),
                value: key,
            } as ISelectOption
        })
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
                                <SelectField
                                    control={control}
                                    defaultValue={""}
                                    name="factType"
                                    label={t("factCategory.factType")}
                                    options={getFactCategoryTypes()}
                                />
                            </Grid>
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
                    </Box>
                </Grid>
            </Grid>
            <FormActions
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default FactCategoryForm
