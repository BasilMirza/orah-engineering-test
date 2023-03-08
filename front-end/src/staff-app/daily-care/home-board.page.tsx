import { faArrowDown, faArrowsAltV, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { TextField } from "@material-ui/core"
import Button from "@material-ui/core/ButtonBase"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"
import { RollInput } from "shared/models/roll"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { ActiveRollAction, ActiveRollOverlay } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import styled from "styled-components"
import * as actions from "../../actions"

interface HomeBoardProps {
  setStudents: (students?: any[]) => void
  setRollStatus: (type: string) => void
  students: any
  rollStatus: any
}

export const HomeBoard: React.FC<HomeBoardProps> = (props) => {
  const [getStudents, data, loadState] = useApi<{ students: any[] }>({ url: "get-homeboard-students" })
  const { setStudents, students, rollStatus, setRollStatus } = props
  const [setStudentsApi] = useApi<{ student: RollInput }>({ url: "save-roll" })
  const navigate = useNavigate()
  const [rollMethod, setRollMethod] = useState(false)
  const [currentName, setCurrentName] = useState({ name: "First Name", value: "first_name" })
  const [searching, setSearch] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isSorting, setIsSorting] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    setStudents(data?.students)
  }, [data, data?.students])

  const onToolbarAction = (action: ToolbarAction, event: any) => {
    switch (action) {
      case "name":
        event?.stopPropagation();
        setStudents(data?.students);
        setSortOrder("desc");
        setIsSorting(false);
        if (currentName.name === "First Name") {
          setCurrentName({ name: "Last Name", value: "last_name" });
        } else {
          setCurrentName({ name: "First Name", value: "first_name" });
        }
        break;
      case "search":
        if (event?.target?.value.length > 0) {
          setSearchValue(event?.target?.value?.toLowerCase().trim());
          setSearch(true);
        } else if (event?.target?.value.length === 0) {
          setSearch(false);
        }
        break;
      case "sort":
        event?.stopPropagation();
        setIsSorting(true);
        if (sortOrder === "desc") {
          setSortOrder("asc");
        } else {
          setSortOrder("desc");
        }
        break;
      case "roll":
        setRollMethod(true);
        break;
      default:
        break;
    }
    
  }

  const onActiveRollAction = (action: ActiveRollAction, value?: string) => {
    if (action === "exit") {
      setRollMethod(false)
    } else if (action === "filter") {
      if (value) {
        setRollStatus(value)
      }
    } else if (action === "save") {
      students.forEach((student: any) => {
        let studentState = {
          student_roll_states: {
            student_id: student.id,
            roll_state: student?.rollState || "unmark",
          },
        }
        setStudentsApi(studentState)
        setRollMethod(false)
        navigate("/staff/activity")
      })
    }
  }

  const sortHomeBoardStudents = (currentStd: any, prevStd: any) => {
    if (!isSorting) return 1;
    
    const currentProp = currentName.value;
    
    const compareValues = (a: any, b: any) => {
      if (a[currentProp] < b[currentProp]) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (a[currentProp] > b[currentProp]) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    };
    
    return compareValues(prevStd, currentStd);
    
  }

  const findStudent = (student: any) => {
    if (searching) {
      let studentName = `${student.last_name} ${student.last_name}`.toLowerCase();
      return studentName.includes(searchValue.toLowerCase());
    } else {
      return true;
    }
    
  }

  const filteringAttendance = (student: any) => {
    if (rollStatus === "all") return student
    return student.rollState === rollStatus
  }
  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} nameDisplay={currentName} sortOrder={sortOrder} isSorting={isSorting} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
       <>
       {students
         .filter(findStudent)
         .filter(filteringAttendance)
         .sort(sortHomeBoardStudents)
         .map((student: any) => (
           <StudentListTile key={student.id} rollMethod={rollMethod} student={student} />
         ))}
     </>
     
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={rollMethod} onItemClick={onActiveRollAction} students={students} />
    </>
  )
}

const HomeBoardPage = connect(mapStateToProps, mapDispatchToProps)(HomeBoard)

export { HomeBoardPage }

type ToolbarAction = "roll" | "sort" | "name" | "search"
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  nameDisplay: any
  sortOrder: string
  isSorting: boolean
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, nameDisplay, sortOrder, isSorting } = props
  return (
    <S.ToolbarContainer>
      <div className="toolbarName" onClick={(e: any) => onItemClick("name", e)}>
        {nameDisplay.name}
        {sortOrder === "desc" ? (
          <FontAwesomeIcon className="arrowIcon" icon={isSorting ? faArrowDown : faArrowsAltV} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        ) : (
          <FontAwesomeIcon className="arrowIcon" icon={faArrowUp} size="1x" onClick={(e: any) => onItemClick("sort", e)} />
        )}
      </div>
      <TextField id="standard-basic" placeholder="Search" multiline={false} onChange={(e: any) => onItemClick("search", e)} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

export function mapStateToProps({ students, rollStatus }: any) {
  return {
    students,
    rollStatus,
  }
}

export function mapDispatchToProps(dispatch: any) {
  return {
    setStudents: (students?: any[]) => dispatch(actions.setStudents(students)),
    setRollStatus: (type: string) => dispatch(actions.setRollStatus(type)),
  }
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}