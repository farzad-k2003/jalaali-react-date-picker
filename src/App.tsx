import moment, { Moment } from "moment";
import { useState } from "react";
import { RangePicker } from "./components/range";

function App() {
  const [date, setDate] = useState<Moment>();

  return (
    <div style={{ flexDirection: "row", display: "flex", gap: 16 }}>
      {/* <Picker
        locale={{ language: "fa" }}
        value={date}
        onChange={(value) => value && setDate(value)}
        onDayChange={(day) => console.log({ dayFa: day })}
        onMonthChange={(month) => console.log({ monthFa: month })}
        onYearChange={(year) => console.log({ yearFa: year })}
        disabledDates={(day) => {
          return day.isBetween(moment().subtract(5, "day"), moment());
        }}
      /> */}

      {/* <button onClick={() => setDate(moment().add(6, "months"))}>
        add 6 months
      </button> */}

      <RangePicker
        locale={{ language: "fa" }}
        disabledDates={(current) => {
          return current.isBefore(moment());
        }}
        format="jMM/jDD/jYYYY"
      />
      <RangePicker locale={{ language: "en" }} />
      {/* <Picker locale={{ language: "fa" }} /> */}
      {/* <Picker
        locale={{ language: "fa" }}
        onMonthChange={(months) => console.log("onMonthChange", months)}
        onYearChange={(years) => console.log("onYearChange", years)}
      /> */}
      {/* <RangePicker
        locale={{ language: "fa" }}
        onMonthChange={(months) => console.log("onMonthChange", months)}
        onYearChange={(years) => console.log("onYearChange", years)}
      /> */}
    </div>
  );
}

export default App;
