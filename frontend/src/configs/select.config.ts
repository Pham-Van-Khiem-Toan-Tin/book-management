import { StylesConfig } from "react-select";
export interface Option {
  label: number;
  value: number;
}
export const selectStyle: StylesConfig<Option, false> = {
  control: (baseStyles) => ({
    ...baseStyles,
    border: "1px solid #ececec",
    boxShadow: "none",
    minWidth: "72px",
    padding: "0rem 0.6rem",
    margin: "0 0.2rem",
    fontSize: "0.9rem",
    "&:hover": {
      borderColor: "#ececec",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    paddingBlock: 0,
    paddingRight: 0,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#a6a6a6",
    fontWeight: 300,
    margin: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "0.2rem 0.6rem",
    fontSize: "0.9rem",
    cursor: "pointer",
    backgroundColor: state.isSelected ? "#00b207" : "transparent",
    "&:hover": {
      backgroundColor: state.isSelected ? "#00b207" : "#dae5da",
    },
  }),
};

export const optionRecord = [
  {
    value: 10,
    label: 10,
  },
  {
    value: 15,
    label: 15,
  },
  {
    value: 20,
    label: 20,
  },
];

interface OptionAsync {
  label: string;
  value: string | number | null;
}
export const selectStyleAsync: StylesConfig<OptionAsync, false> = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    border: "1px solid #ececec",
    boxShadow: state.isFocused ? "0 0 0 1px #00b207" : "none",
    padding: "0.6rem 1rem",
    fontSize: "0.9rem",
    "&:hover": {
      borderColor: "#ececec",
    },
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    paddingBlock: 0,
    paddingRight: 0,
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#a6a6a6",
    fontWeight: 300,
    margin: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "0.6rem 1rem",
    fontSize: "0.9rem",
    cursor: "pointer",
    backgroundColor: state.isSelected ? "#00b207" : "transparent",
    "&:hover": {
      backgroundColor: state.isSelected ? "#00b207" : "#dae5da",
    },
  }),
};
