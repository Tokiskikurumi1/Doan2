CREATE OR ALTER PROCEDURE sp_get_assignment_info
    @assignmentID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Thông tin bài tập
    SELECT
        a.assignmentID,
        a.assignmentName,
        a.assignmentCourse,
        a.assignmentType,
        a.assignmentDeadline,
        a.assignmentDuration,
        a.assignmentDes,
        a.assignmentStatus,
        a.videoID,
        v.videoName
    FROM ASSIGNMENT a
    INNER JOIN VIDEO_COURSE v ON a.videoID = v.videoID
    WHERE a.assignmentID = @assignmentID;

    -- 2. Danh sách câu hỏi trong bài tập
    SELECT
        q.questionID,
        q.assignmentID,
        q.questionType,
        q.content,
        q.original,
        q.rewritten,
        q.questionIndex
    FROM QUESTION q
    WHERE q.assignmentID = @assignmentID;

    -- 3. Danh sách câu trả lời cho các câu hỏi
    SELECT
        ans.answerID,
        ans.questionID,
        ans.answerText,
        ans.isCorrect,
        ans.answerIndex
    FROM ANSWER ans
    WHERE ans.questionID IN (
        SELECT questionID FROM QUESTION WHERE assignmentID = @assignmentID
    );
END
GO
