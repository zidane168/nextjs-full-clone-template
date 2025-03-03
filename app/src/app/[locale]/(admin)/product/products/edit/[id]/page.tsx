"use client"

import { getProduct, selectProduct } from "@/redux/features/product/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import Form from "../../form"

import { ACTION_PATH } from "@/utils/constants"

import { useEffect } from "react"

import { IChickenPotProductDetail } from "@/types/product"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"

const EditProduct = () => {
    const { id } = useParams()
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const initValue = useAppSelector(selectProduct)

    const fetchItem = async () => {
        await dispatch(getProduct(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("product.edit")} currentPathname={pathname} />
            <Form
                initValue={initValue as IChickenPotProductDetail}
                action={ACTION_PATH.edit}
                id={id as string}
            />
        </div>
    )
}

export default EditProduct
