import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import "./ClassPage.scss";

import StyledFraction from "../../components/styled-fraction/StyledFraction";
import NotificationPill from "../../components/notification-pill/NotificationPill";
import IconInput from "../../components/icon-input/IconInput";
import CustomButton from "../../components/custom-button/CustomButton";
import Loading from "../../components/loading/Loading";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

import { useParams } from "react-router-dom";
import generateColor from "../../utils/color-from-string";
import { fetchClassDetails } from "../../utils/url/fetch-handler";
import ExcuseModal from "../../components/excuse-modal/ExcuseModal";
import {
  sendAssistanceCode,
  generateToken
} from "../../utils/url/post-handler";
import StudentListModal from "../../components/student-list-modal/StudentListModal";
import CreateNoticeModal from "../../components/create-notice-modal/CreateNoticeModal";
import ProfessorAbsenceModal from "../../components/professor-absence-modal/ProfessorAbsenceModal";

const ClassPage = ({ currentClasses, currentUser }) => {
  const { courseName } = useParams();
  const [currentClass, setCurrentClass] = useState({ noticesList: [] });
  const [classHead, setClassHead] = useState({});
  const [color, setColor] = useState("white");
  const [createExcuse, setCreateExcuse] = useState(false);
  const [absence, setAbsence] = useState(false);
  const [createNotice, setCreateNotice] = useState(false);
  const [studentListModal, setStudentListModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  let isProfessor = currentUser.role === "Professor";

  const handleChange = event => {
    const { value } = event.target;
    setToken(value);
  };

  const generateNewToken = async () => {
    setLoading(true);
    let token = await generateToken(classHead.sectionId, "00:30:00");
    setToken(token);
    setLoading(false);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    await sendAssistanceCode(currentClass.sectionId, currentUser.dbId, token);
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let searchedClass = await currentClasses.find(
        cour => cour.course === courseName
      );
      fetchClassDetails(setCurrentClass, searchedClass.sectionId).then(
        setLoading(false)
      );
      setClassHead(searchedClass);
      setColor(generateColor(`${searchedClass.course}1`));
    };
    fetchData();
  }, [currentClasses, courseName]);

  return (
    <div className="class-page">
      <div className="class-title">
        <span className="title">
          {currentClass.course ? currentClass.course : "Cargando. . ."}
        </span>
      </div>
      <div className="class-page-content">
        <div className="class-content">
          <div className="class-item">
            <span className="class-item-subtitle">Ausencias</span>
            <div className="class-divider" />
            {isProfessor ? (
              <div className="class-absence">
                <CustomButton
                  color={color}
                  width="auto"
                  text="Notificar Ausencia"
                  onClick={() => setAbsence(true)}
                />
                <CustomButton
                  color={color}
                  width="auto"
                  text="Agendar Reposición"
                />
              </div>
            ) : (
              <StyledFraction
                color={color}
                numerator={classHead.absences}
                denominator={currentClass.credits}
              />
            )}
          </div>
          <div className="class-item">
            <span className="class-item-subtitle">Avisos</span>
            <div className="class-divider" />
            <div className="class-notification-container">
              {currentClass.noticesList ? (
                currentClass.noticesList.map((notification, index) => (
                  <div
                    key={index}
                    className="notification-individual-container"
                  >
                    <NotificationPill
                      notification={notification}
                      color={color}
                    />
                  </div>
                ))
              ) : (
                <div className="class-no-notices">
                  No tienes avisos pendientes.
                </div>
              )}
            </div>
            {isProfessor ? (
              <CustomButton
                color={color}
                width="auto"
                text="Crear Aviso"
                onClick={() => setCreateNotice(true)}
              />
            ) : null}
          </div>
        </div>
        {isProfessor ? (
          <div className="class-content">
            <div className="class-item">
              <span className="class-item-subtitle">Asistencia Manual</span>
              <div className="class-divider" />
              <div className="class-absence">
                <CustomButton
                  color={color}
                  width="auto"
                  text="Ver Registro"
                  onClick={() => {
                    setStudentListModal(true);
                    console.log("hi");
                  }}
                />
                <CustomButton color={color} width="auto" text="Validar ID" />
              </div>
            </div>
            <div className="class-item">
              <span className="class-item-subtitle">Código de Asistencia</span>
              <div className="class-divider" />
              <div className="class-absence">
                <IconInput icon={faCopy} value={token || ""} disabled />
                <CustomButton
                  color={color}
                  width="16rem"
                  text="Generar Código"
                  onClick={generateNewToken}
                />
              </div>
            </div>
            <StudentListModal
              visible={studentListModal}
              setVisible={setStudentListModal}
              color={color}
              id={classHead.sectionId}
            />
            <CreateNoticeModal
              visible={createNotice}
              setVisible={setCreateNotice}
              color={color}
              id={classHead.sectionId}
            />
            <ProfessorAbsenceModal
              visible={absence}
              setVisible={setAbsence}
              color={color}
              id={classHead.sectionId}
            />
          </div>
        ) : (
          <React.Fragment>
            <form className="single-class-item" onSubmit={handleSubmit}>
              <span className="class-item-subtitle">Asistencia</span>
              <div className="class-divider" />
              <div className="class-code-container">
                <IconInput
                  spellCheck="false"
                  maxLength={10}
                  required
                  minLength={10}
                  onChange={handleChange}
                  icon={faCopy}
                  pattern="[A-Za-z0-9]{1,20}"
                />
              </div>
              <div className="class-buttons">
                <CustomButton
                  color={color}
                  width="auto"
                  text="Enviar código"
                  type="submit"
                />
                <CustomButton
                  color={color}
                  width="auto"
                  text="Crear excusa"
                  onClick={() => setCreateExcuse(true)}
                />
                <ExcuseModal
                  visible={createExcuse}
                  setVisible={setCreateExcuse}
                  color={color}
                  id={classHead.sectionId}
                />
              </div>
            </form>
          </React.Fragment>
        )}
        <Loading visible={loading} />
      </div>
    </div>
  );
};

const mapStateToProps = ({ classes, user }) => ({
  currentClasses: classes.currentClasses,
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(ClassPage);
