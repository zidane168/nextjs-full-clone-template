"use client"

import { getBrandDetail, selectBrandDetail } from "@/redux/features/brand/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { IBrand } from "@/types/brand"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditBrand = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectBrandDetail)

    const fetchItem = async () => {
        await dispatch(getBrandDetail({ id: Number(id) }))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("brand.edit")} currentPathname={pathname} />
            <Form
                initialValue={{ ...initValue } as IBrand}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditBrand
