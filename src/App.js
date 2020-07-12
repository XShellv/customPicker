import React, { useState, useRef, useEffect } from "react";
import Calendar from "rc-calendar";
import moment from "moment";
import "./App.scss";
import zhCN from "rc-calendar/lib/locale/zh_CN";

const start = moment().add("-6", "months");
const end = moment().add("-1", "months");
function App() {
  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);

  const onClick = (e) => {
    setOpen(true);
    e.nativeEvent.stopImmediatePropagation();
  };

  useEffect(() => {
    const btn = document.getElementById("warn-info").parentNode.lastChild;
    btn.addEventListener("click", () => {
      setOpen(false);
    });
    document.addEventListener("click", () => {
      setOpen(false);
    });

    return () => {
      document.removeEventListener("click", () => {
        setOpen(false);
      });
      btn.removeEventListener("click", () => {
        setOpen(false);
      });
    };
  }, []);

  const disabledDate = (current) => {
    if (selectedDates.length > 0) {
      if (selectedDates.length === 1) {
        return (
          current > moment(selectedDates.sort()[0]).add(1, "d") ||
          current < moment(selectedDates.sort()[0]).add(-1, "d")
        );
      } else {
        return (
          current > moment(selectedDates.sort()[0]).add(1, "d") ||
          current < moment(selectedDates.sort()[0])
        );
      }
    } else {
      return current > end || current < start;
    }
  };

  const handleOk = (date) => {
    setOpen(false);
  };

  const onSelect = (value) => {
    const insertVal = value.startOf("d").valueOf();
    setSelectedDates((dates) => {
      if (selectedDates.includes(insertVal)) {
        return dates.filter((date) => date !== insertVal);
      } else {
        return [...dates, insertVal];
      }
    });
  };
  return (
    <div>
      <span tabIndex="0" onClick={onClick}>
        <input
          readOnly
          tabIndex="-1"
          className="ant-calendar-picker-input ant-input"
          value={
            selectedDates.length > 0
              ? selectedDates.map((date) => moment(date).format("YYYY-MM-DD"))
              : "请选择查询日期"
          }
        />
      </span>
      <div
        style={{ width: 250 }}
        onClick={(e) => {
          e.nativeEvent.stopImmediatePropagation();
        }}
      >
        <Calendar
          open={open}
          locale={zhCN}
          style={{ zIndex: 1000, display: open ? "block" : "none" }}
          showDateInput={false}
          showOk={true}
          onOk={handleOk}
          onSelect={onSelect}
          disabledDate={disabledDate}
          defaultValue={end}
          renderFooter={() => (
            <span
              id="warn-info"
              style={{ color: "orange" }}
            >{`提示：最多支持连续两天查询`}</span>
          )}
          dateRender={(current, value) => {
            const findDate = selectedDates.find(
              (d) =>
                moment(current).startOf("d").valueOf() === moment(d).valueOf()
            );
            if (findDate) {
              return (
                <span
                  className="rc-calendar-date"
                  style={{ background: "#337ab7", color: "#fff" }}
                >
                  {current.date()}
                </span>
              );
            }
            return <span className="rc-calendar-date">{current.date()}</span>;
          }}
        />
      </div>
    </div>
  );
}

export default App;
