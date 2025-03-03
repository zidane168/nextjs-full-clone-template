"use client"

import { getFood, selectFood } from "@/redux/features/food/reducer"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ACTION_PATH } from "@/utils/constants"
import { PageHeading } from "@/views/DynamicComponent/DynamicComponent"
import { useTranslations } from "next-intl"
import { useParams, usePathname } from "next/navigation"
import { useEffect } from "react"
import Form from "../../form"

const EditFood = () => {
    const { id } = useParams()
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    const initValue = useAppSelector(selectFood)

    const fetchItem = async () => {
        await dispatch(getFood(id as string))
    }

    useEffect(() => {
        fetchItem()
    }, [])

    return (
        <div>
            <PageHeading title={t("food.edit")} currentPathname={pathname} />
            <Form initialValue={initValue} action={ACTION_PATH.edit} id={id as string} />
        </div>
    )
}

export default EditFood
