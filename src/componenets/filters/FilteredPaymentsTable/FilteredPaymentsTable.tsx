import { Table, Checkbox, Text, Accordion, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import type { IMonthlyPayment } from '../../../types/installment';
import {
  IconSquareRoundedChevronDown,
  IconCalendarDollar,
} from '@tabler/icons-react';

interface PaymentListTableProps {
  payments: IMonthlyPayment[];
  isSelected: (paymentId: string) => boolean;
  onToggle: (paymentId: string, paymentAmount: number) => void;
  onToggleAll: () => void;
}

const FilteredPaymentsTable = ({
  payments,
  isSelected,
  onToggle,
  onToggleAll,
}: PaymentListTableProps) => {
  const { t } = useTranslation();

  const isAllSelected = payments.every((payment) => isSelected(payment._id));

  const rows = payments.map((payment) => {
    const formattedDate = dayjs(payment.date).format('D MMM, YYYY');
    const formattedPaidDate = payment.paidDate
      ? dayjs(payment.paidDate).format('D MMM, YYYY')
      : null;

    return (
      <Table.Tr
        key={payment._id}
        onClick={() => onToggle(payment._id, payment.amount)}
        style={{ cursor: 'pointer' }}
      >
        <Table.Td>
          <Checkbox
            checked={isSelected(payment._id)}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(payment._id, payment.amount);
            }}
            readOnly
          />
        </Table.Td>
        <Table.Td>
          <Text fw={500}>{formattedDate}</Text>
          {payment.paid && formattedPaidDate && (
            <Text size='xs' c='teal.5'>
              {t('components.paymentItem.paidLabel', {
                date: formattedPaidDate,
              })}
            </Text>
          )}
        </Table.Td>
        <Table.Td>
          <Text fw={600}>{payment.amount} ₼</Text>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Accordion
      variant='filled'
      chevron={<IconSquareRoundedChevronDown color='gray' />}
      chevronSize={20}
    >
      <Accordion.Item value='payments'>
        <Accordion.Control icon={<IconCalendarDollar size={20} color='gray' />}>
          <Text size='sm' fw={600} c='gray'>
            {t('components.filteredPaymentsTable.accordionLabel')}
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  {payments.length > 1 && (
                    <Tooltip label={t('tooltips.selectAll')}>
                      <Checkbox
                        checked={isAllSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleAll();
                        }}
                        readOnly
                      />
                    </Tooltip>
                  )}
                </Table.Th>
                <Table.Th>
                  {t('components.filteredPaymentsTable.tableHeader.date')}
                </Table.Th>
                <Table.Th>
                  {t('components.filteredPaymentsTable.tableHeader.amount')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default FilteredPaymentsTable;
