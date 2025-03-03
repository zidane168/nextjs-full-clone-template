import CustomImage from "@/components/Form/CustomImage"
import { createProduct, updateProduct } from "@/redux/features/product/reducer"
import {
    getProductCategories,
    selectProductCategories,
} from "@/redux/features/productCategory/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IFieldLanguage } from "@/types/common"
import {
    IChickenPotProductCreate,
    IChickenPotProductDetail,
    IChickenPotProductUpdate,
} from "@/types/product"
import { ACTIONS, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import {
    backMainPage,
    checkFormIsDirtyAndNavigateBack,
    dateToIsoString,
    extractMediasObjects,
    transformDate,
} from "@/utils/helpers/common"
import {
    DatePickerField,
    FormActions,
    InputField,
    MultiLanguages,
    RadioGroupField,
    SelectField,
    UploadFileField,
} from "@/views/DynamicComponent/DynamicComponent"
import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, Grid } from "@mui/material"
import dayjs from "dayjs"
import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-toastify"
import * as yup from "yup"

interface IProductForm {
    id?: string
    initValue?: IChickenPotProductDetail
    action: string
}

const Form = (props: IProductForm) => {
    const t = useTranslations()
    const { id, initValue, action } = props
    const locale = useLocale()
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()
    const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([])
    const categories = useAppSelector(selectProductCategories)

    yup.addMethod(yup.mixed, "fileRequired", function (message) {
        return this.test("fileRequired", message, value => {
            if (value) return true
            return false
        })
    })

    const requireMessage = t("validation.itemIsRequiredField")
    const itemIsGreaterThanZero = t("validation.itemIsGreaterThanZero")
    const itemIsInvalidType = t("validation.itemIsInvalidType")
    const unpublishDateValidate = t("validation.unpublishDateValidate")
    const unPublishDateFutureValidate = t("validation.unPublishDateFutureValidate")
    const priceValidate = t("validation.priceValidate")

    const ItemSchema = yup
        .object()
        .shape({
            categoryId: yup.number().required(requireMessage),
            // thumbnailId: yup.number().required(requireMessage),
            // coverImageId: yup.number().required(requireMessage),

            published: yup.date().typeError(itemIsInvalidType).required(requireMessage),
            unpublished: yup
                .date()
                .min(yup.ref("published"), unpublishDateValidate)
                .test(
                    "is-greater-than-now",
                    unPublishDateFutureValidate,
                    value => value !== undefined && value > new Date(),
                )
                .typeError(itemIsInvalidType)
                .required(requireMessage),
            price: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .min(0.01, itemIsGreaterThanZero)
                .typeError(itemIsInvalidType)
                .required(requireMessage),
            // .test("is-greater-than-original-price", priceValidate, function (value) {
            //     const { discount } = this.parent
            //     return discount == null || value >= discount
            // }),
            discount: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .min(0.01, itemIsGreaterThanZero)
                .typeError(itemIsInvalidType)
                .optional()
                .nullable(),

            sort: yup
                .number()
                .transform((value, originalValue) => {
                    return originalValue === "" ? null : value
                })
                .required(requireMessage),

            popular: yup.boolean().typeError(requireMessage).required(requireMessage),
            bestSeller: yup.boolean().typeError(requireMessage).required(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),

            name: yup
                .object()
                .shape({
                    en: yup.string().required(requireMessage),
                    tc: yup.string().required(requireMessage),
                    sc: yup.string().required(requireMessage),
                })
                .required(),
            content: yup
                .object()
                .shape({
                    en: yup.string().required(requireMessage),
                    tc: yup.string().required(requireMessage),
                    sc: yup.string().required(requireMessage),
                })
                .required(),
        })
        .required()

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty, errors },
    } = useForm({
        resolver: yupResolver<any>(ItemSchema),
        defaultValues: { enabled: true },
    })

    const {
        fields: fieldsMedias,
        append: appendMedias,
        remove: removeMedias,
    } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "mediaIds", // unique name for your Field Array
    })

    const {
        fields: fieldsUpdatedMedia,
        append: appendUpdatedMedia,
        remove: removeUpdatedMedia,
    } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "deleteMediaIds", // unique name for your Field Array
    })

    const handleRemoveCurrentProductImages = (
        { id, url, initId }: { id: string; url: string; initId: string },
        index: number,
    ) => {
        let clone = [...deleteMediaIds]
        clone.push(Number(initId))
        setDeleteMediaIds([...clone])
        removeUpdatedMedia(index)
    }
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

    const onSubmit = async (data: IChickenPotProductCreate | IChickenPotProductUpdate) => {
        const payload = {
            ...data,
            published: dateToIsoString(data.published),
            unpublished: dateToIsoString(data.unpublished),
        }

        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }
        if (action === ACTIONS.create) {
            const value = await dispatch(createProduct(payload as IChickenPotProductCreate))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            const value = await dispatch(
                updateProduct({
                    ...payload,
                    id: id || "",
                    deleteMediaIds,
                } as IChickenPotProductUpdate),
            )
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    const getProductCategoriesOptions = () => {
        return categories.map((element: any) => {
            return {
                value: element.id,
                label: element.name?.[locale as keyof IFieldLanguage] ?? "",
            }
        })
    }

    const fetchCates = () => {
        dispatch(getProductCategories())
    }

    useEffect(() => {
        fetchCates()
    }, [])

    useEffect(() => {
        if (initValue) {
            const { ...rest } = initValue

            reset({
                ...rest,
                categoryId: initValue?.category?.id,
                deleteMediaIds: extractMediasObjects(initValue?.medias || []),
                mediaIds: [],
            })
        }
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
                                    <SelectField
                                        name="categoryId"
                                        label={t("common.category")}
                                        control={control}
                                        options={getProductCategoriesOptions()}
                                    />
                                </Grid>
                            </Grid>

                            <MultiLanguages control={control} fields={multiLangFields} />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <UploadFileField
                                        name="thumbnailId"
                                        label={t("common.thumbnail")}
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <UploadFileField
                                        name="coverImageId"
                                        label={t("common.coverImage")}
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <DatePickerField
                                        name="published"
                                        label={t("common.published")}
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <DatePickerField
                                        name="unpublished"
                                        label={t("common.unpublished")}
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <InputField
                                        name="price"
                                        label={t("common.price")}
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField
                                        name="discount"
                                        id="discount"
                                        label={t("common.originalPrice")}
                                        control={control}
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <InputField
                                        name="sort"
                                        type="number"
                                        label={t("common.sort")}
                                        control={control}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <RadioGroupField
                                        name="enabled"
                                        control={control}
                                        label={t("common.isActive")}
                                        options={[
                                            { label: t("common.true"), value: true },
                                            {
                                                label: t("common.false"),
                                                value: false,
                                            },
                                        ]}
                                    />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <RadioGroupField
                                        name="bestSeller"
                                        control={control}
                                        label={t("common.bestSeller")}
                                        options={[
                                            { label: t("common.true"), value: true },
                                            {
                                                label: t("common.false"),
                                                value: false,
                                            },
                                        ]}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <RadioGroupField
                                        name="popular"
                                        control={control}
                                        label={t("product.popular")}
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
                            <Grid item md={6} xs={12}>
                                <ul>
                                    {fieldsMedias.map((item, index: number) => {
                                        return (
                                            <li key={item.id}>
                                                <Button
                                                    color="error"
                                                    onClick={() => {
                                                        removeMedias(index)
                                                    }}>
                                                    {t("common.delete")}
                                                </Button>
                                                <UploadFileField
                                                    control={control}
                                                    name={`mediaIds.${index}`}
                                                    label="common.thumbnail"
                                                />
                                            </li>
                                        )
                                    })}

                                    <Button
                                        type="button"
                                        onClick={() => {
                                            appendMedias([1])
                                        }}>
                                        {t("common.addImage")}
                                    </Button>
                                </ul>
                                <ul>
                                    {fieldsUpdatedMedia.map((item: any, index: number) => {
                                        return (
                                            <li key={item.id}>
                                                <Button
                                                    color="error"
                                                    onClick={() => {
                                                        handleRemoveCurrentProductImages(
                                                            item,
                                                            index,
                                                        )
                                                    }}>
                                                    {t("common.delete")}
                                                </Button>
                                                <div>
                                                    <CustomImage src={item.url} />
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                <FormActions
                    isValid={Object.keys(errors).length === 0}
                    backMainPage={() => backMainPage(pathname, action, router)}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    )
}

export default Form
