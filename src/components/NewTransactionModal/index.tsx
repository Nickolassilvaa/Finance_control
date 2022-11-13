import { useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import * as Dialog from '@radix-ui/react-dialog';

import { TransactionContext } from '../../contexts/TransactionsContext';

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome']),
})

type NewtransactionFormInputs = z.infer<typeof newTransactionFormSchema>

export function NewTransactionModal() {
  const { createTransaction } = useContext(TransactionContext)
  
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset
  } = useForm<NewtransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: 'income'
    }
  })

  async function handleCreateNewTransaction(data: NewtransactionFormInputs) {
    const { category, description, price, type } = data
    
    await createTransaction({
      description,
      price,
      category,
      type
    })

    reset()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder='Descrição'
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder='Preço'
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder='Categoria'
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field }) => {

              return (
                <TransactionType onValueChange={field.onChange} value={field.value}>
                  <TransactionTypeButton value='income' variant='income'>
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton value='outcome' variant='outcome'>
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />



          <button type="submit" disabled={isSubmitting} >
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}