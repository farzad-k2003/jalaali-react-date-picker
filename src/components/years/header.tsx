import RightIconDouble from "../../assets/icons/keyboard_double_arrow_right.svg";
import LeftIconDouble from "../../assets/icons/keyboard_double_arrow_left.svg";
import classNames from "classnames";
import { useDatepicker } from "../../core";

export interface HeaderProps {
  lowerDecade: number;
  upperDecade: number;
  onIncreaseDecade: () => void;
  onDecreaseDecade: () => void;
}

const YearsHeader = ({
  lowerDecade,
  upperDecade,
  onDecreaseDecade,
  onIncreaseDecade,
}: HeaderProps) => {
  const { isJalaali } = useDatepicker();

  return (
    <div className="panel-header-rtl">
      <div className="panel-header-inner">
        <div className="center">
          <img
            className="iconItem"
            src={RightIconDouble}
            onClick={() =>
              isJalaali ? onDecreaseDecade() : onIncreaseDecade()
            }
          />
        </div>
        <div className="panel-date-holder">
          <div
            className={classNames(
              "panel-date-holder-item",
              isJalaali
                ? "panel-date-holder-item-rtl"
                : "panel-date-holder-item-ltr",
            )}
          >
            {isJalaali ? (
              <p className="clickable">{`${upperDecade}-${lowerDecade}`}</p>
            ) : (
              <p className="clickable">{`${lowerDecade}-${upperDecade}`}</p>
            )}
          </div>
        </div>
        <div className="center">
          <img
            className="iconItem"
            src={LeftIconDouble}
            onClick={() =>
              isJalaali ? onIncreaseDecade() : onDecreaseDecade()
            }
          />
        </div>
      </div>
    </div>
  );
};

export { YearsHeader };