import dynamic from 'next/dynamic';

export const RadioGroupField = dynamic(() => import('@/components/RadioGroupField'), { ssr: false });
export const SearchActions = dynamic(() => import('@/components/Actions/SearchActions'), { ssr: false });
export const SelectField = dynamic(() => import('@/components/Form/SelectField'), { ssr: false });
export const InputField = dynamic(() => import('@/components/Form/InputField'), { ssr: false });
export const PageHeading = dynamic(() => import('@/components/PageHeading'), { ssr: false });
export const DataTable = dynamic(() => import('@/components/DataTable/DataTable'), { ssr: false });
export const PagePagination = dynamic(() => import('@/components/PagePagination'), { ssr: false });
export const FormActions = dynamic(() => import('@/components/Actions/FormActions'), { ssr: false });
export const DetailContent = dynamic(() => import('@/components/DetailContent'), { ssr: false });
export const PermissionAccordion = dynamic(() => import('@/components/PermissionAccordion'), { ssr: false });
export const MultiLanguages = dynamic(() => import('@/components/Form/MultiLanguages/MultiLanguages'), { ssr: false });
export const DatePickerField = dynamic(() => import('@/components/Form/DatePickerField'), { ssr: false });
export const TimePickerField = dynamic(() => import('@/components/Form/TimePickerField'), { ssr: false });
export const UploadFileField = dynamic(() => import('@/components/Form/UploadFileField'), { ssr: false });
export const AutoCompleteSelect = dynamic(() => import('@/components/AutoCompleteSelect'), { ssr: false });
export const MultiSelectField = dynamic(() => import('@/components/Form/MultiSelectField'), { ssr: false });