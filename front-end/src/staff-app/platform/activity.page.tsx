import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect } from "react"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"
import { RolllStateType } from "shared/models/roll"
import { Colors } from "shared/styles/colors"
import { BorderRadius, Spacing } from "shared/styles/styles"
import styled from "styled-components"

export const ActivityPage: React.FC = () => {
  const [getStudents, data, loadState] = useApi<{ activity: any[] }>({ url: "get-activities" })

  useEffect(() => {
    void getStudents()
  }, [])

  return (
    <S.Container>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {loadState === "loaded" &&
        data?.activity.map((list: any, i) => {
          return (
            <S.ActivityItems key={i}>
              <span>{list.entity.name}</span>
              <S.ActivityStatus>
                <S.Icon size={20} border={list.entity.student_roll_states.roll_state === "unmark"} bgColor={getBgColor(list.entity.student_roll_states.roll_state)}>
                  <FontAwesomeIcon icon="check" size={"lg"} />
                </S.Icon>
                <span>
                  <span>Completed On: </span>
                  <span>{list.entity.completed_at.split("T")[0]}</span>
                </span>
              </S.ActivityStatus>
            </S.ActivityItems>
          )
        })}

      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Container>
  )
}

function getBgColor(type: RolllStateType) {
  switch (type) {
    case "unmark":
      return "#fff"
    case "present":
      return "#13943b"
    case "absent":
      return "#9b9b9b"
    case "late":
      return "#f5a623"
    default:
      return "#13943b"
  }
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  ActivityItems: styled.div<{ key: number }>`
    display: flex;
    justify-content: space-between;
    height: 70px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 7px rgb(5 66 145 / 13%);
    margin-top: 12px;
    align-items: center;
    padding: 0 10px 0 10px;
    color: #4e4e4e;
    font-weight: 600;
    flex-wrap: wrap;
  `,
  Icon: styled.div<{ size: number; border: boolean; bgColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: ${({ bgColor }) => bgColor};
  border: 2px solid ${({ border }) => (border ? Colors.dark.lighter : "transparent")};
  border-radius: ${BorderRadius.rounded};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  margin-bottom: 10px;
`,
ActivityStatus: styled.div`
  display: flex;
  flex-direction: column;
  align-items: inherit;
`,
}
