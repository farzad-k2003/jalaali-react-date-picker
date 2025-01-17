import moment, { Moment } from "moment-jalaali";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  dateTransformer,
  formatGenerator,
  getCurrentYear,
  getDateMonth,
  getDateYear,
  momentTransformer,
} from "../../../utils";
import { localizedMonth } from "../../constants";
import { DatePickerProps } from "../../interfaces";
import { Date, Locale } from "../../types/global.types";
import { DateActionKind, reducer } from "./dateReducer";

interface DateReducerType {
  formatProp?: string;
  onChangeProp?: DatePickerProps["onChange"];
  valueProp?: DatePickerProps["value"];
  defaultValueProp?: DatePickerProps["defaultValue"];
  onDayChangeProp?: DatePickerProps["onDayChange"];
  onMonthChangeProp?: DatePickerProps["onMonthChange"];
  onYearChangeProp?: DatePickerProps["onYearChange"];
  locale: Locale;
  setOffset?: (offset: number) => void;
}

/**
 * GetDefaultValue is a helper function that returns an object with the default
 * day, year, and month values.
 */
const getDefaultValue = (
  value: Moment | null | undefined,
  isJalaali: boolean,
) => {
  const _value = value || moment();

  return {
    day: 0,
    year: getDateYear(_value, isJalaali),
    month: getDateMonth(_value, isJalaali),
  };
};

/**
 * Formats the given moment using either the provided format or a format
 * generated by the formatGenerator function.
 */
function formatter(value: Moment, isJalaali: boolean, format?: string): string {
  return value.format(format ? format : formatGenerator(isJalaali));
}

/** Check whether the given date object is valid or not. */
function isDateObjectValid(date: Date): boolean {
  return date && date.day !== 0;
}

export const useDateReducer = ({
  formatProp,
  valueProp,
  defaultValueProp,
  onChangeProp,
  onDayChangeProp,
  onMonthChangeProp,
  onYearChangeProp,
  locale,
}: DateReducerType) => {
  const isJalaali = locale === "fa";

  const months = localizedMonth[locale];

  /** State to hold the cached date. */
  const [cacheDate, setCacheDate] = useState<Date>(
    getDefaultValue(defaultValueProp, isJalaali),
  );

  /** State and Dispatch hook for managing the date. */
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultValue(defaultValueProp, isJalaali),
  );

  const [offset, setterOffset] = useState<number>(0);

  const [inputValue, setInputValue] = useState<string>("");

  /** State to hold the placeholder text. */
  const [placeholder, setPlaceholder] = useState<string>("");

  const formattedValue = useCallback(
    (value: Moment) => formatter(value, isJalaali, formatProp),
    [formatProp, isJalaali],
  );

  /** Clears the selected date and input value. */
  const onClear = () => {
    onDateChange(null);
    setInputValue("");
  };

  /** Callback function that updates the placeholder text of the input field. */
  const changePlaceholder = useCallback(
    (date: Date | null) => {
      if (!date) return setPlaceholder("");

      const fInputValue = formattedValue(dateTransformer(date, isJalaali));

      setPlaceholder(fInputValue);
    },
    [formattedValue, isJalaali],
  );

  useEffect(() => {
    setterOffset(state.year - getCurrentYear(isJalaali));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJalaali, inputValue]);

  /**
   * UseEffect hook that updates the cached date and input value when the
   * valueProp or defaultValueProp changes.
   */
  useEffect(() => {
    if (valueProp) {
      const value = momentTransformer(valueProp, isJalaali);

      setCacheDate(value);

      setInputValue(formattedValue(valueProp));
    } else if (defaultValueProp) {
      const value = momentTransformer(defaultValueProp, isJalaali);

      setCacheDate(value);

      setInputValue(formattedValue(defaultValueProp));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValueProp, valueProp]);

  /**
   * This function is a callback function that updates the selected date and
   * dispatches an action.
   */
  const onDateChange = useCallback(
    (payload: Date | null) => {
      if (payload === null) {
        setPlaceholder("");

        dispatch({ type: DateActionKind.DAY, payload: { ...state, day: 0 } });

        setCacheDate((prev) => ({ ...prev, day: 0 }));

        return onChangeProp?.(null, "");
      }

      dispatch({ type: DateActionKind.DATE, payload });

      setCacheDate(payload);

      const res = dateTransformer({ ...payload }, isJalaali);

      if (isDateObjectValid(payload)) {
        onChangeProp?.(res, formattedValue(res));
      }
    },
    [isJalaali, onChangeProp, formattedValue, state],
  );

  /**
   * This function is a callback function that updates the selected date day and
   * dispatches an action.
   */
  const onDaychange = useCallback(
    (payload: Date) => {
      dispatch({ type: DateActionKind.DAY, payload });

      setCacheDate(payload);

      if (isDateObjectValid(payload)) {
        onDayChangeProp?.(payload.day);

        setInputValue("");
      }
    },
    [onDayChangeProp],
  );

  /**
   * This function is a callback function that updates the selected date month
   * and dispatches an action.
   */
  const onMonthchange = useCallback(
    (payload: Date) => {
      dispatch({ type: DateActionKind.MONTH, payload });

      const name = months.find(({ id }) => id === payload.month)?.name || "--";

      onMonthChangeProp?.({
        value: payload.month,
        name,
      });
    },
    [months, onMonthChangeProp],
  );

  /**
   * This function is a callback function that updates the selected date year
   * and dispatches an action.
   */
  const onYearchange = useCallback(
    (payload: Date) => {
      dispatch({ type: DateActionKind.YEAR, payload });

      onYearChangeProp?.(payload.year);
    },

    [onYearChangeProp],
  );

  /**
   * This function is a callback function that increases the selected date year
   * and dispatches an action.
   */
  const onIncreaseYear = useCallback(
    (payload: Date) => {
      dispatch({
        type: DateActionKind.YEAR_PLUS,
        payload: {
          ...payload,
          day: cacheDate?.year === payload.year ? cacheDate.day : 0,
        },
      });
    },
    [cacheDate.day, cacheDate?.year],
  );

  /**
   * This function is a callback function that decreases the selected date year
   * and dispatches an action.
   */
  const onDecreaseYear = useCallback(
    (payload: Date) => {
      dispatch({
        type: DateActionKind.YEAR_MINUS,
        payload: {
          ...payload,
          day: cacheDate?.year === payload.year ? cacheDate.day : 0,
        },
      });
    },
    [cacheDate.day, cacheDate?.year],
  );

  /**
   * This function is a callback function that increases the selected date month
   * and dispatches an action.
   */
  const onIncreaseMonth = useCallback(
    (payload: Date) => {
      dispatch({
        type: DateActionKind.MONTH_PLUS,
        payload: {
          ...payload,
          day: cacheDate?.month === payload.month ? cacheDate.day : 0,
          year: payload.month === 12 ? payload.year + 1 : payload.year,
        },
      });
    },
    [cacheDate.day, cacheDate?.month],
  );

  /**
   * This function is a callback function that decreases the selected date month
   * and dispatches an action.
   */
  const onDecreaseMonth = useCallback(
    (payload: Date) => {
      dispatch({
        type: DateActionKind.MONTH_MINUS,
        payload: {
          ...payload,
          day: cacheDate?.month === payload.month ? cacheDate.day : 0,
          year: payload.month === 1 ? payload.year - 1 : payload.year,
        },
      });
    },
    [cacheDate.day, cacheDate?.month],
  );

  /** This function is used to handle changes to the input field value. */
  const onChangeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userData = e.target.value;

    const format = formatProp ? formatProp : formatGenerator(isJalaali);

    const momentValue = moment(userData, format, true);

    setInputValue(userData);

    if (momentValue.isValid()) {
      onDateChange(momentTransformer(momentValue, isJalaali));

      onMonthchange(momentTransformer(momentValue, isJalaali));

      onYearchange(momentTransformer(momentValue, isJalaali));

      return;
    }

    onDateChange(null);
  };

  const { dateValue } = useMemo(() => {
    let dateValue = "";

    if (isDateObjectValid(state)) {
      dateValue = formattedValue(dateTransformer(state, isJalaali));
    }

    return { dateValue };
  }, [formattedValue, isJalaali, state]);

  const setOffset = (offset: number) => {
    setterOffset(offset);
  };

  return {
    state,
    cacheDate,
    onDateChange,
    onDaychange,
    onMonthchange,
    onYearchange,
    onIncreaseYear,
    onDecreaseYear,
    onIncreaseMonth,
    onDecreaseMonth,
    changePlaceholder,
    onClear,
    offset,
    setOffset,
    inputProps: {
      value: inputValue || dateValue,
      placeholder,
      onChangeInputValue,
      onClear,
      isJalaali,
    },
  };
};
