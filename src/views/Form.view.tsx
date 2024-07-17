import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, TextField } from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useUpdateAnswers } from '../api-hooks/useUpdateAnswers'
import { CheckboxGroup } from '../components'
import { useAnswersStore } from '../state'

import { validationSchema } from './Form.config'

export const FormView = () => {
    const answers = useAnswersStore(state => state.getAnswers())
    const transformedOptions = answers.interests.map(interest => {
        const key = Object.keys(interest)[0]
        return {
            id: key,
            checked: interest[Number(key)].isChecked,
            ...interest[Number(key)],
        }
    }) as {
        id: string
        isChecked: boolean
        label: string
        checked: boolean
    }[]

    console.log('transformedOptions', transformedOptions)

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: answers.name,
            mail: answers.mail,
            age: answers.age,
            interests: transformedOptions,
        },
        values: {
            ...answers,
            interests: transformedOptions,
        },
    })

    const updateAnswersMutation = useUpdateAnswers()

    const onSubmit = handleSubmit(formData => {
        updateAnswersMutation.mutate({
            name: formData.name,
            mail: formData.mail,
            age: formData.age,
            interests:
                formData?.interests?.map(interest => {
                    const key = interest.id
                    return {
                        [key]: {
                            isChecked: interest.isChecked,
                            label: interest.label,
                        },
                    }
                }) ?? [],
        })
    })

    return (
        <div id="form-view">
            <Box
                display="flex"
                gap={4}
                sx={{ flexDirection: 'column', width: '300px' }}
            >
                <Controller
                    name="name"
                    control={control}
                    defaultValue={answers.name}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Name"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.name?.message || ''}
                            error={Boolean(errors.name?.message)}
                        />
                    )}
                />
                <Controller
                    name="age"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Age"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.age?.message || ''}
                            error={Boolean(errors.age?.message)}
                        />
                    )}
                />
                <Controller
                    name="mail"
                    control={control}
                    defaultValue={answers.mail}
                    render={({ field: { onChange, value } }) => (
                        <TextField
                            label="Email"
                            variant="standard"
                            onChange={onChange}
                            value={value}
                            helperText={errors.mail?.message || ''}
                            error={Boolean(errors.mail?.message)}
                        />
                    )}
                />
                {/*
                    TASK 2:
                    - Integrate CheckboxGroup into the form, controlled
                    by react-hook-form.
                    - Do NOT modify types of answers.interests or
                    CheckboxGroup's options. This could be detrimental
                    to your final assessment.
                */}
                <Controller
                    name="interests"
                    control={control}
                    render={({ field: { onChange, value }, fieldState }) => (
                        <CheckboxGroup
                            error={Boolean(fieldState.error)}
                            onChange={onChange}
                            options={value}
                        />
                    )}
                />
                <Button
                    variant="contained"
                    disabled={!isValid}
                    onClick={onSubmit}
                >
                    Submit
                </Button>
            </Box>
        </div>
    )
}
