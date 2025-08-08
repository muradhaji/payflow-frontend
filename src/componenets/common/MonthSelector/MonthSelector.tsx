import { Tooltip } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';

import dayjs from 'dayjs';

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  tooltip?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}

const MonthSelector = ({
  value,
  onChange,
  disabled = false,
  tooltip,
  minDate,
  maxDate,
}: MonthSelectorProps) => {
  const handleChange = (date: Date | string | null) => {
    if (date) {
      onChange(dayjs(date).format('YYYY-MM'));
    }
  };

  return (
    <Tooltip label={tooltip} disabled={!tooltip}>
      <div>
        <MonthPickerInput
          value={dayjs(value, 'YYYY-MM').toDate()}
          onChange={handleChange}
          disabled={disabled}
          allowDeselect={false}
          clearable={false}
          minDate={minDate ?? undefined}
          maxDate={maxDate ?? undefined}
          size='xs'
          mx='auto'
        />
      </div>
    </Tooltip>
  );
};

export default MonthSelector;
