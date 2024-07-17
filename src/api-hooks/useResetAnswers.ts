import { useMutation } from 'react-query'

import { resetAnswersFromApi } from '../api/api'
import { apiToDomainAnswersConverter } from '../api/converters'
import { useAnswersStore } from '../state'

// TASK 6:
// - You need to implement a new hook called useResetAnswers.
// - Once implemented, you should be able to use this hook in the Table view.

export const useResetAnswers = () => {
    const answers = useAnswersStore(state => state)
    const resetAnswersMutation = useMutation(() => resetAnswersFromApi())

    const reset = () => {
        resetAnswersMutation.mutate()
        answers.setAnswers(
            apiToDomainAnswersConverter({
                age: '',
                interests: answers.interests.map(option => {
                    const key = Object.keys(option)[0]

                    return {
                        [Number(key)]: {
                            ...option[Number(key)],
                            isChecked: false,
                            checked: false,
                        },
                    }
                }),
                email: '',
                username: '',
            }),
        )
    }

    return {
        reset,
    }
}
