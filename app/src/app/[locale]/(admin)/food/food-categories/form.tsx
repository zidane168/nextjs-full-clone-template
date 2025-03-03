"use client"

import SelectField from "@/components/Form/SelectField"
import UploadFileField from "@/components/Form/UploadFileField"
import { createFoodCategory, updateFoodCategory } from "@/redux/features/foodCategory/reducer"
import { useAppDispatch } from "@/redux/hooks"
import {
    IFoodCategory,
    IFoodCategoryCreateRequest,
    IFoodCategoryUpdateRequest,
} from "@/types/food-category"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { useFetchBrand } from "@/utils/hooks/useFetchBrand"
import { useFetchFoodCategory } from "@/utils/hooks/useFetchFoodCategory"
import {
    FormActions,
    InputField,
    MultiLanguages,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Grid } from "@mui/material"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"

interface IFoodCategoryForm {
    id?: string
    initialValue?: IFoodCategory
    action: string
}

const ProductCategoryForm = (props: IFoodCategoryForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")
    const itemIsInvalidType = t("validation.itemIsInvalidType")

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
            sort: yup.number().typeError(itemIsInvalidType).optional(),
            brandId: yup.number().required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
        })
        .required()

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
    ]
    const locale = useLocale()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: {
            enabled: true,
        },
    })
    const brands = useFetchBrand(locale)
    const aaa = useFetchFoodCategory(locale)
    const onSubmit = async (data: IFoodCategoryCreateRequest) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createFoodCategory(data as IFoodCategoryCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(
                updateFoodCategory({ ...data, id } as IFoodCategoryUpdateRequest),
            )
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    useEffect(() => {
        reset({
            ...initialValue,
            brandId: initialValue?.brand?.id,
        })
    }, [initialValue])

    return (
        <form id="client-form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <MultiLanguages control={control} fields={multiLangFields} />
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <InputField
                                control={control}
                                name="sort"
                                label={t("common.sort")}
                                id="sort"
                                type="number"
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <SelectField
                                control={control}
                                name="brandId"
                                options={brands.listItemOptions}
                                label={t("common.brand")}
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
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            <UploadFileField
                                control={control}
                                name={`thumbnailId`}
                                label="Thumbnail"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <FormActions
                backMainPage={() => backMainPage(pathname, action, router)}
                isSubmitting={isSubmitting}
            />
        </form>
    )
}

export default ProductCategoryForm
