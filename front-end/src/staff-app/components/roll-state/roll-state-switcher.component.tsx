import React, { useState } from "react";
import { connect } from 'react-redux';
import { Person } from "shared/models/person";
import { RolllStateType } from "shared/models/roll";
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component";
import * as actions from '../../../actions';

export function mapDispatchToProps(dispatch: any) {
  return {
    setAttendanceStatus: (type:string, id:number ):any => dispatch(actions.setAttendanceStatus(type, id)),
  };
}

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  student: Person
  setAttendanceStatus?: (type: string, id: number) => void  
}
 const RollStateSwitch: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange,student, setAttendanceStatus }) => {
  const [rollState, setRollState] = useState(student?.rollState || initialState)

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    if (setAttendanceStatus) {
      setAttendanceStatus(next, student.id)
    }
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
const RollStateSwitcher = connect(null, mapDispatchToProps)(RollStateSwitch);

export { RollStateSwitcher };
