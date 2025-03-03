import { IMultiLanguageField } from "@/types/common"
import {
    MULTI_LANGUAGE_FIELD,
    WEBSITE_LANGUAGES,
    reactQuillFormats,
    reactQuillModules,
} from "@/utils/constants"
import { InputField } from "@/views/DynamicComponent/DynamicComponent"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, FormControl, FormHelperText, FormLabel, Grid, Tab } from "@mui/material"
import { useTranslations } from "next-intl"
import React, { useEffect, useState } from "react"
import { Control, Controller, FieldErrors } from "react-hook-form"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import useStyles from "./MultiLanguages.styles"

interface IMultiLanguage {
    control: Control<any>
    fields: IMultiLanguageField[]
    prefixName?: string
    locale?: string
    fieldIndex?: number
    nestedFieldIndex?: number
    errors?: FieldErrors<any>
}

const MultiLanguages = (props: IMultiLanguage) => {
    const t = useTranslations()
    const { classes } = useStyles()
    const { control, fields, prefixName, locale, fieldIndex, nestedFieldIndex } = props
    const [tabIndex, setTabIndex] = useState(WEBSITE_LANGUAGES[0])

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue)
    }

    // Handle switch to tab that have error
    useEffect(() => {
        if (!control._formState.errors) return

        const errorLanguage = WEBSITE_LANGUAGES.find(lang => {
            return fields.some(field => {
                if (field.arrayParent && fieldIndex !== null && fieldIndex !== undefined) {
                    const fieldName = field.name
                    if (
                        field.nestedArray &&
                        nestedFieldIndex !== null &&
                        nestedFieldIndex !== undefined
                    ) {
                        const arrayError = control._formState.errors[field.arrayParent] as any
                        const nestedArrayError =
                            arrayError &&
                            arrayError[fieldIndex] &&
                            arrayError[fieldIndex][field.nestedArray]
                        const target =
                            nestedArrayError && nestedArrayError[nestedFieldIndex]
                                ? nestedArrayError[nestedFieldIndex][fieldName]
                                : {}
                        return lang in target
                    }
                    const arrayError = control._formState.errors[field.arrayParent] as any
                    return (
                        lang in
                        ((arrayError &&
                            arrayError[fieldIndex] &&
                            arrayError[fieldIndex][fieldName]) ||
                            {})
                    )
                }
                return lang in (control._formState.errors[field.name] || {})
            })
        })

        if (errorLanguage) {
            setTabIndex(errorLanguage)
        }
    }, [control._formState.errors])

    const renderField = (field: IMultiLanguageField, lang: string, index: number) => {
        switch (field.type) {
            case MULTI_LANGUAGE_FIELD.TEXT:
                return (
                    <InputField
                        id={!prefixName ? field.name + locale : prefixName + field.name + locale}
                        key={index}
                        control={control}
                        name={`${prefixName ? `${prefixName}.` : ""}${field.name}.${lang}`}
                        label={t(`formLanguage.${field.name}.${lang}`)}
                    />
                )
            case MULTI_LANGUAGE_FIELD.TEXTAREA:
                return (
                    <InputField
                        id={!prefixName ? field.name + locale : prefixName + field.name + locale}
                        key={index}
                        control={control}
                        name={`${prefixName ? `${prefixName}.` : ""}${field.name}.${lang}`}
                        label={t(`formLanguage.${field.name}.${lang}`)}
                        multiline={true}
                        rows={5}
                    />
                )
            case MULTI_LANGUAGE_FIELD.RICHTEXT:
                return (
                    <Controller
                        control={control}
                        name={`${prefixName ? `${prefixName}.` : ""}${field.name}.${lang}`}
                        key={index}
                        render={({ field, fieldState }) => (
                            <FormControl fullWidth error={fieldState.invalid}>
                                <FormLabel
                                    style={{
                                        position: "relative",
                                        left: "10px",
                                        transform: "scale(0.75)",
                                        transformOrigin: "top left",
                                    }}>
                                    {t(`formLanguage.${field.name}`)}
                                </FormLabel>
                                <ReactQuill
                                    id={
                                        !prefixName
                                            ? field.name + locale
                                            : prefixName + field.name + locale
                                    }
                                    value={field.value}
                                    modules={reactQuillModules}
                                    formats={reactQuillFormats}
                                    className={
                                        fieldState.invalid
                                            ? classes.quillEditorError
                                            : classes.quillEditor
                                    }
                                    onChange={field.onChange}
                                />
                                <FormHelperText>{fieldState.error?.message ?? " "}</FormHelperText>
                            </FormControl>
                        )}
                    />
                )
        }
    }

    return (
        <Box
            sx={{
                padding: "10px",
                border: "1px solid #ddd",
                marginBottom: "10px",
            }}>
            <TabContext value={tabIndex}>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: "#9A7F56",
                    }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        {WEBSITE_LANGUAGES.map(item => (
                            <Tab label={t(`language.${item}`)} value={item} key={item}></Tab>
                        ))}
                    </TabList>
                </Box>
                {WEBSITE_LANGUAGES.map(item => (
                    <TabPanel value={item} key={item}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                {fields.map((field: IMultiLanguageField, i: number) =>
                                    renderField(field, item, i),
                                )}
                            </Grid>
                        </Grid>
                    </TabPanel>
                ))}
            </TabContext>
        </Box>
    )
}

export default MultiLanguages
