import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useResetAnswers } from '../api-hooks/useResetAnswers'
import { useAnswersStore } from '../state'

// TASK 4:
// - Implement the table from this mockup (public/table_view_mockup.png).
// - Display answers from store in table.
// - Each row of the table body should have the name of the answer
// and its value.
// - Add the edit and delete buttons on top of the table.

// TASK 5:
// - Redirect to Form view on edit button click.

// TASK 6:
// - Invoke useResetAnswers hook on delete button click.
// - See useResetAnswers hook for more guidelines.

export const TableView = () => {
    const answers = useAnswersStore(state => state.getAnswers())
    const navigate = useNavigate()

    const { reset } = useResetAnswers()

    const tableAnswers = Object.values(answers).map(answer => {
        if (typeof answer !== 'string') {
            return answer
                .filter(option => {
                    const key = Object.keys(option)[0]
                    return option[Number(key)].isChecked
                })
                .map(option => {
                    const key = Object.keys(option)[0]

                    return option[Number(key)].label
                })
                .join(', ')
        }
        return answer
    })

    const tableQuestions = Object.keys(answers)

    const onClickEdit = () => navigate('/form')

    const onClickDelete = () => {
        reset()
    }

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingX: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: 2,
                }}
            >
                <IconButton onClick={onClickEdit} aria-label="Edit">
                    <EditIcon />
                </IconButton>
                <IconButton onClick={onClickDelete} aria-label="Delete">
                    <DeleteIcon />
                </IconButton>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Questions</TableCell>
                            <TableCell>Answers</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableQuestions.map((question, i) => (
                            <TableRow key={question}>
                                <TableCell>{question}</TableCell>
                                <TableCell>{tableAnswers[i]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}
