import React, { useState } from "react"
import { Control, useController } from "react-hook-form"
import { Box, Button, Input } from "@mui/material"
import Image from "next/image"
import { useTranslations } from "next-intl"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import fileApi from "@/services/api/setting/file.api"
import Swal from "sweetalert2"
import { getFileType, getImageDimensions, imageLoader } from "@/utils/helpers/common"
import {
    IMAGE_TYPES,
    MAXIMUM_IMAGE_SIZE,
    MAXIMUM_THUMBNAIL_IMAGE_SIZE,
    RATIO_IMAGE_MATCHED,
} from "@/utils/constants"
import { DimensionFile } from "@/types/common"

export interface InputProps {
    name: string
    control: Control<any>
    label: string
    disabled?: boolean
    canUploadVideo?: boolean
    isNeedToCheckDimension?: boolean
    imageType?: string
}

const UploadFileField = (props: InputProps) => {
    const t = useTranslations()

    const [preview, setPreview] = useState<File | null>(null)
    const {
        name,
        control,
        label,
        disabled = false,
        imageType = "",
        canUploadVideo = true,
        isNeedToCheckDimension = false,
    } = props
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"]
    const validTypes = [...validImageTypes, ...(canUploadVideo ? validVideoTypes : [])]

    const {
        field: { value, onChange, ref },
        fieldState: { error },
    } = useController({ name, control })

    const isValidFile = (file: File) => file && validTypes.includes(file.type)

    const uploadFile = async (file: File) => {
        setPreview(file)
        const formData = new FormData()
        formData.append("file", file)
        const { data } = await fileApi.uploadFile(formData)
        if (data?.data?.id) {
            onChange(data.data.id)
        }
    }

    const showError = () => {
        Swal.fire({
            title: t("swal.invalidFileType"),
            text: t("swal.invalidFileText"),
            icon: "error",
            confirmButtonText: t("swal.OK"),
        })
    }
    const showDimensionError = (errorCase: number) => {
        switch (errorCase) {
            case 1:
                return Swal.fire({
                    title: t("swal.fileTooLarge"),
                    text: t("swal.fileTooLargeContent"),
                    icon: "error",
                    confirmButtonText: t("swal.OK"),
                })
            case 2:
                return Swal.fire({
                    title: t("swal.wrongRatio"),
                    text: t("swal.wrongRatioContent"),
                    icon: "error",
                    confirmButtonText: t("swal.OK"),
                })
            default:
                break
        }
    }
    const dimensionErrorCase = ({ size, width, height }: DimensionFile): number => {
        const MAXIMUM_SIZE =
            imageType === IMAGE_TYPES.THUMBNAIL ? MAXIMUM_THUMBNAIL_IMAGE_SIZE : MAXIMUM_IMAGE_SIZE
        let errorCase = 0
        if (size > MAXIMUM_SIZE) {
            errorCase = 1
        }
        if (Number(width / height).toFixed(1) != RATIO_IMAGE_MATCHED) {
            errorCase = 2
        }
        return errorCase
    }
    const handleChangeFile = async (e: any) => {
        const file = e.target.files[0]

        const { size } = file
        const { width, height } = await getImageDimensions(file)

        // Dimension check
        if (isNeedToCheckDimension === true) {
            const dimensionError = dimensionErrorCase({ size, width, height })
            if (dimensionError !== 0) {
                showDimensionError(dimensionError)
                return
            }
        }
        // Dimension check
        if (isValidFile(file)) {
            await uploadFile(file)
        } else {
            showError()
        }
    }

    const handleOnLoadImage = (event: any) => {}
    const isImage = (value: any, preview: File | null) =>
        (typeof value === "string" && getFileType(value) === "image") ||
        (preview && validImageTypes.includes(preview.type))

    const isVideo = (value: any, preview: File | null) =>
        (typeof value === "string" && getFileType(value) === "video") ||
        (preview && validVideoTypes.includes(preview.type))

    const DisplayImage = ({ value, preview }: { value: any; preview: File | null }) => (
        <Box sx={{ padding: "5px", width: "150px" }}>
            <Image
                loader={imageLoader}
                unoptimized
                height={150}
                width={150}
                style={{ objectFit: "contain" }}
                src={preview ? URL.createObjectURL(preview) : value}
                alt={""}
            />
        </Box>
    )

    const DisplayVideo = ({ value, preview }: { value: any; preview: File | null }) => (
        <video controls width="150px">
            <source src={preview ? URL.createObjectURL(preview) : value} type={preview?.type} />
            Your browser does not support the video tag.
        </video>
    )

    return (
        <Box sx={{ marginBottom: "24px" }}>
            <Box sx={{ display: "flex", gap: 4, padding: "16px 0" }} alignItems="center">
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={disabled}>
                    {t("common.uploadFile")} {label}
                    <Input
                        sx={{ display: "none" }}
                        type="file"
                        onChange={handleChangeFile}
                        onLoad={handleOnLoadImage}
                    />
                    <Input sx={{ display: "none" }} value={value || ""} inputRef={ref} />
                </Button>
                <Box sx={{ fontSize: "14px" }}>
                    {error ? <Box sx={{ color: "#d32f2f" }}> {error?.message} </Box> : ""}
                </Box>
            </Box>
            {(value || preview) && isImage(value, preview) ? (
                <DisplayImage value={value} preview={preview} />
            ) : isVideo(value, preview) ? (
                <DisplayVideo value={value} preview={preview} />
            ) : null}
        </Box>
    )
}

export default UploadFileField
