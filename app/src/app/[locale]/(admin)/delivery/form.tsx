"use client"

import * as yup from "yup"

import { ACTIONS, LANGUAGE_INIT_DATA, MULTI_LANGUAGE_FIELD } from "@/utils/constants"
import { Box, Button, Grid, IconButton, Stack } from "@mui/material"
import {
    FormActions,
    MultiLanguages,
    RadioGroupField,
} from "@/views/DynamicComponent/DynamicComponent"
import {
    IDeliveryCreateRequest,
    IDeliveryFormdata,
    IDeliveryItem,
    IDeliveryUpdateRequest,
} from "@/types/delivery"
import { backMainPage, checkFormIsDirtyAndNavigateBack } from "@/utils/helpers/common"
import { createDelivery, updateDelivery } from "@/redux/features/delivery/reducer"
import { useFieldArray, useForm } from "react-hook-form"
import { usePathname, useRouter } from "next/navigation"

import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import InputField from "@/components/Form/InputField"
import UploadFileField from "@/components/Form/UploadFileField"
import { toast } from "react-toastify"
import { useAppDispatch } from "@/redux/hooks"
import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { yupResolver } from "@hookform/resolvers/yup"

interface IDeliveryForm {
    id?: string
    initialValue?: IDeliveryFormdata
    action: string
}

const DeliveryForm = (props: IDeliveryForm) => {
    const t = useTranslations()
    const { id, initialValue, action } = props
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const router = useRouter()

    const requireMessage = t("validation.itemIsRequiredField")
    const itemMin1 = t("validation.itemMin1")

    yup.addMethod(yup.mixed, "fileRequired", function (message) {
        return this.test("fileRequired", message, value => {
            if (value) return true
            return false
        })
    })

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
            url: yup.string().required(requireMessage),
            thumbnailId: (yup.mixed() as any).fileRequired(requireMessage),
            enabled: yup.boolean().typeError(requireMessage).required(requireMessage),
            deliveryItems: yup
                .array()
                .of(
                    yup.object().shape({
                        url: yup.string().required(requireMessage),
                        name: LanguageValidation,
                        thumbnailId: (yup.mixed() as any).fileRequired(requireMessage),
                    }),
                )
                .min(1, itemMin1)
                .required(requireMessage),
        })
        .required()

    const initDeliveryItem = {
        name: LANGUAGE_INIT_DATA,
        url: "",
        thumbnailId: undefined,
    } as IDeliveryItem

    const multiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
        },
    ]

    const deliveryMultiLangFields = [
        {
            name: "name",
            type: MULTI_LANGUAGE_FIELD.TEXT,
            arrayParent: "deliveryItems",
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

    const {
        fields: deliveryItemFields,
        append: deliveryItemAppend,
        remove: deliveryItemRemove,
        replace: deliveryItemReplace,
    } = useFieldArray({
        control,
        name: "deliveryItems",
    })

    const onSubmit = async (data: IDeliveryFormdata) => {
        if (checkFormIsDirtyAndNavigateBack(isDirty, pathname, action, router)) {
            return
        }

        const { thumbnailId, thumbnail, ...restData } = data

        if (action === ACTIONS.create) {
            const value = await dispatch(createDelivery(data as IDeliveryCreateRequest))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsCreatedSuccessful"))
                backMainPage(pathname, action, router)
            }
        } else {
            // const deliveryItems = data.deliveryItems.map((item: IDeliveryItem) => {
            //     const { thumbnailId: itemThumbnailId, thumbnail, ...restItem } = item
            //     const hasUpdatedItemThumbnailId = typeof itemThumbnailId !== "string"
            //     return {
            //         ...restItem,
            //         ...(hasUpdatedItemThumbnailId && { thumbnailId: itemThumbnailId }),
            //     }
            // })
            const hasUpdatedThumbnailId = typeof thumbnailId !== "string"
            const updateData = {
                ...restData,
                ...(hasUpdatedThumbnailId && { thumbnailId }),
                // deliveryItems: deliveryItems,
                id,
            } as IDeliveryUpdateRequest
            const value = await dispatch(updateDelivery(updateData))
            if (!(value as any)?.error) {
                toast.success(t("message.itemIsUpdateSuccessful"))
                backMainPage(pathname, action, router)
            }
        }
    }

    const renderDeliveryItem = (id: string, deliveryIndex: number) => {
        const styleNotFirstSection = {
            mt: "2rem",
        }
        return (
            <Grid
                container
                spacing={2}
                key={id}
                sx={deliveryIndex !== 0 ? styleNotFirstSection : {}}>
                <Grid item xs={1}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }} key={id}>
                        {deliveryIndex + 1}.{" "}
                    </Box>
                </Grid>
                <Grid item xs={10}>
                    <Grid container spacing={2}>
                        <Grid item md={8} xs={12}>
                            <MultiLanguages
                                control={control}
                                fields={deliveryMultiLangFields}
                                prefixName={`deliveryItems.${deliveryIndex}`}
                                fieldIndex={deliveryIndex}
                            />
                        </Grid>
                        <Grid item md={4} xs={12}>
                            <Stack justifyContent="center" sx={{ height: "100%" }}>
                                <InputField
                                    control={control}
                                    name={`deliveryItems.${deliveryIndex}.url`}
                                    label={t("common.url")}
                                    id={`deliveryItems.${deliveryIndex}.url`}
                                />
                                <UploadFileField
                                    name={`deliveryItems.${deliveryIndex}.thumbnailId`}
                                    control={control}
                                    label={t("common.thumbnail")}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                    <IconButton
                        aria-label={t("common.remove")}
                        onClick={() =>
                            deliveryItemFields.length > 1 && deliveryItemRemove(deliveryIndex)
                        }>
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        )
    }

    useEffect(() => {
        if (initialValue) {
            reset({ ...initialValue, thumbnailId: initialValue.thumbnail })
        }
    }, [initialValue])

    useEffect(() => {
        if (!initialValue?.deliveryItems) {
            deliveryItemReplace([initDeliveryItem])
        }
        if (initialValue?.deliveryItems && initialValue?.deliveryItems?.length >= 1) {
            deliveryItemReplace(
                initialValue.deliveryItems.map(item => ({
                    ...item,
                    thumbnailId: item.thumbnail,
                    // thumbnail: item.thumbnailId,
                })),
            )
        }
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
                                <InputField name="url" control={control} label={t("common.url")} />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <UploadFileField
                                    name="thumbnailId"
                                    control={control}
                                    label={t("common.thumbnail")}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid
                        container
                        spacing={2}
                        borderTop={"1px solid #ccc"}
                        sx={{ marginTop: "0px" }}>
                        <Grid item xs={12}>
                            <h4>{t("delivery.deliveryItems")}</h4>
                        </Grid>
                    </Grid>
                    {deliveryItemFields.map((item, deliveryIndex) => {
                        return renderDeliveryItem(item.id, deliveryIndex)
                    })}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 4,
                                    marginBottom: "20px",
                                }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => deliveryItemAppend(initDeliveryItem)}
                                    startIcon={<AddIcon />}>
                                    {t("delivery.deliveryItem")}
                                </Button>
                            </Box>
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

export default DeliveryForm
