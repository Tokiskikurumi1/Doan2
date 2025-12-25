	CREATE DATABASE LMS;
	GO

    drop database LMS
	USE LMS;
	GO

	/* ===================== ROLES ===================== */
	CREATE TABLE ROLES(
		roleID INT PRIMARY KEY,  
		roleName NVARCHAR(50) UNIQUE NOT NULL
	);

	/* ===================== USER_TABLE ===================== */
	CREATE TABLE USER_TABLE(
		userID INT IDENTITY(1,1) PRIMARY KEY,
		userName NVARCHAR(50) NOT NULL,
		Date_of_Birth DATE NULL,
		gender NVARCHAR(10) NULL CHECK (gender IN (N'Nam', N'Nữ', N'Khác')),
		district NVARCHAR(20) NULL,
		province NVARCHAR(20) NULL,
		phoneNumber CHAR(10)  NULL CHECK (phoneNumber IS NULL OR (phoneNumber NOT LIKE '%[^0-9]%' AND LEN(phoneNumber) = 10)),
		Email VARCHAR(100) NOT NULL
			CHECK (
				email LIKE '%_@_%._%' AND
				email NOT LIKE '%[^a-zA-Z0-9@._-]%'
			),

		Account VARCHAR(20) NOT NULL,
		Pass VARCHAR(20) NOT NULL,
		roleID INT NOT NULL
	);


	ALTER TABLE USER_TABLE ADD CONSTRAINT FK_USER_ROLE FOREIGN KEY(roleID) REFERENCES ROLES(roleID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	/* ===================== COURSE ===================== */
	CREATE TABLE COURSE (
		courseID INT IDENTITY(1,1) PRIMARY KEY,
		teacherID INT NOT NULL,
		courseName NVARCHAR(50) NOT NULL,
		courseType NVARCHAR(50) NOT NULL,
		courseDes NVARCHAR(200) NOT NULL,
		courseDate DATE NOT NULL,
		coursePrice DECIMAL(10,3) NOT NULL,
		courseStatus NVARCHAR(20) NOT NULL CHECK(courseStatus IN ('completed', 'incomplete')),
		courseImage VARCHAR(255) NULL
	);



	CREATE TABLE TYPE_COURSE
	(
		typeID INT PRIMARY KEY,
		typeName NVARCHAR(50) UNIQUE NOT NULL
	)

	/* ===================== VIDEO_COURSE ===================== */
	CREATE TABLE VIDEO_COURSE(
		videoID INT IDENTITY(1,1) PRIMARY KEY,
		courseID INT NOT NULL,
		videoName NVARCHAR(100) NOT NULL,
		videoURL VARCHAR(255) NOT NULL,
		videoProgress NVARCHAR(50) NOT NULL CHECK (videoProgress IN ('completed', 'incomplete'))
	);

	ALTER TABLE VIDEO_COURSE 
	ADD CONSTRAINT FK_VIDEO_COURSE FOREIGN KEY(courseID)
	REFERENCES COURSE(courseID)
	ON UPDATE CASCADE ON DELETE CASCADE;

		/* ===================== ASSIGNMENT ===================== */
		CREATE TABLE ASSIGNMENT(
			assignmentID INT IDENTITY(1,1) PRIMARY KEY,
			teacherID INT NOT NULL,
			videoID INT NOT NULL,
			assignmentName NVARCHAR(50) NOT NULL,
			assignmentCourse NVARCHAR(50) NOT NULL,
			assignmentType NVARCHAR(20) NOT NULL,
			assignmentDeadline DATETIME,
			assignmentDuration INT NOT NULL,
			assignmentDes NVARCHAR(100) NOT NULL,
			assignmentStatus VARCHAR(20) NOT NULL CHECK (assignmentStatus IN ('completed', 'incomplete'))

		);


		ALTER TABLE ASSIGNMENT 
		ADD CONSTRAINT FK_ASSIGNMENT_TEACHER FOREIGN KEY(teacherID)
		REFERENCES USER_TABLE(userID)
		ON UPDATE CASCADE ON DELETE CASCADE;

		ALTER TABLE ASSIGNMENT 
		ADD CONSTRAINT FK_ASSIGNMENT_COURSE FOREIGN KEY(videoID)
		REFERENCES VIDEO_COURSE(videoID)
		ON UPDATE CASCADE ON DELETE CASCADE;

		/* ===================== QUESTION ===================== */
		CREATE TABLE QUESTION (
			questionID INT IDENTITY(1,1) PRIMARY KEY,
			assignmentID INT NOT NULL,
			questionType NVARCHAR(20) NOT NULL CHECK (questionType IN ('Quizz', 'Reading', 'Rewrite')),
			content NVARCHAR(200) NULL,
			original NVARCHAR(200) NULL,
			rewritten NVARCHAR(200) NULL,
			questionIndex INT NOT NULL
		);


		ALTER TABLE QUESTION 
		ADD CONSTRAINT FK_QUESTION_ASSIGNMENT FOREIGN KEY(assignmentID)
		REFERENCES ASSIGNMENT(assignmentID)
		ON UPDATE CASCADE ON DELETE CASCADE;

		/* ===================== ANSWER ===================== */
		CREATE TABLE ANSWER (
			answerID INT IDENTITY(1,1) PRIMARY KEY,
			questionID INT NOT NULL,
			answerText NVARCHAR(200) NOT NULL,
			isCorrect BIT NOT NULL DEFAULT 0,
			answerIndex INT NOT NULL
		);

		ALTER TABLE ANSWER 
		ADD CONSTRAINT FK_ANSWER_QUESTION FOREIGN KEY(questionID)
		REFERENCES QUESTION(questionID)
		ON UPDATE CASCADE ON DELETE CASCADE;

		CREATE TABLE TYPE_ASSIGNMENT(
		typeID INT PRIMARY KEY,
		typeName NVARCHAR(20) NOT NULL UNIQUE
		);

INSERT INTO TYPE_ASSIGNMENT(typeID, typeName) VALUES
(1,'quizz'), (2,'reading'), (3,'rewrite');


CREATE TABLE STUDENT_COURSE (
    userID          INT,
    courseID        INT,
    enrollDate      DATETIME DEFAULT GETDATE(),
    progressPercent DECIMAL(5,2) DEFAULT 0.00,
	isComplete VARCHAR(20) NOT NULL CHECK (isComplete IN ('completed', 'incomplete')),
    completedDate   DATETIME NULL,
    PRIMARY KEY (userID, courseID),
    FOREIGN KEY (userID) REFERENCES USER_TABLE(userID),
    FOREIGN KEY (courseID) REFERENCES COURSE(courseID)
);

END
GO


--================================================================================================--
--============================================ ĐĂNG NHẬP ==============================================--
--================================================================================================--

-- PROCEDURE ĐĂNG NHẬP
CREATE OR ALTER PROCEDURE sp_login
    @Account VARCHAR(20),
    @Pass VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.userID,
        u.userName,
		u.Email,  
        u.roleID,
        r.roleName
    FROM USER_TABLE u
    INNER JOIN ROLES r ON u.roleID = r.roleID
    WHERE u.Account = @Account AND u.Pass = @Pass;
END
GO


/* ===================== COMMENTS ===================== */
IF OBJECT_ID('COMMENTS', 'U') IS NOT NULL
    DROP TABLE COMMENTS;
GO

CREATE TABLE COMMENTS (
    commentID INT IDENTITY(1,1) PRIMARY KEY,       -- Khóa chính tự tăng
    userID INT NOT NULL,                           -- Người viết comment
    videoID INT NOT NULL,                          -- Video mà comment thuộc về
    commentText NVARCHAR(500) NOT NULL,            -- Nội dung comment
    commentTime DATETIME NOT NULL DEFAULT GETDATE(), -- Thời điểm comment

    CONSTRAINT FK_COMMENTS_USER FOREIGN KEY(userID)
        REFERENCES USER_TABLE(userID)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT FK_COMMENTS_VIDEO FOREIGN KEY(videoID)
        REFERENCES VIDEO_COURSE(videoID)
        ON UPDATE CASCADE ON DELETE CASCADE
);
GO


/* ===================== SCORE ===================== */
IF OBJECT_ID('SCORE', 'U') IS NOT NULL
    DROP TABLE SCORE;
GO

CREATE TABLE SCORE (
    scoreID INT IDENTITY(1,1) PRIMARY KEY,       -- Khóa chính tự tăng
    studentID INT NOT NULL,                      -- Liên kết tới USER_TABLE
    courseID INT NOT NULL,                       -- Liên kết tới COURSE
    assignmentID INT NOT NULL,                   -- Liên kết tới ASSIGNMENT
    subject NVARCHAR(100) NOT NULL,              -- Tên bài tập / môn học
    correct INT NOT NULL,                        -- Số câu đúng
    total INT NOT NULL,                          -- Tổng số câu
    score DECIMAL(5,2) NOT NULL,                 -- Điểm số (ví dụ: 100.00)
    date DATETIME NOT NULL DEFAULT GETDATE(),    -- Ngày làm bài

    CONSTRAINT FK_SCORE_STUDENT FOREIGN KEY(studentID)
        REFERENCES USER_TABLE(userID)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT FK_SCORE_COURSE FOREIGN KEY(courseID)
        REFERENCES COURSE(courseID)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT FK_SCORE_ASSIGNMENT FOREIGN KEY(assignmentID)
        REFERENCES ASSIGNMENT(assignmentID)
        ON UPDATE CASCADE ON DELETE NO ACTION   -- sửa để tránh multiple cascade paths
);
GO


/* ===================== ASSIGNMENT_PROGRESS ===================== */
IF OBJECT_ID('ASSIGNMENT_PROGRESS', 'U') IS NOT NULL
    DROP TABLE ASSIGNMENT_PROGRESS;
GO

CREATE TABLE ASSIGNMENT_PROGRESS (
    progressID INT IDENTITY(1,1) PRIMARY KEY,       -- Khóa chính tự tăng
    studentID INT NOT NULL,                         -- Liên kết tới USER_TABLE
    assignmentID INT NOT NULL,                      -- Liên kết tới ASSIGNMENT
    status NVARCHAR(20) NOT NULL                    -- Trạng thái: 'not_started', 'completed'
        CHECK (status IN ('not_started', 'completed')),
    startDate DATETIME NULL,                        -- Ngày bắt đầu làm
    completedDate DATETIME NULL,                    -- Ngày hoàn thành

    CONSTRAINT FK_PROGRESS_STUDENT FOREIGN KEY(studentID)
        REFERENCES USER_TABLE(userID)
        ON UPDATE CASCADE ON DELETE CASCADE,

    CONSTRAINT FK_PROGRESS_ASSIGNMENT FOREIGN KEY(assignmentID)
        REFERENCES ASSIGNMENT(assignmentID)
        ON UPDATE CASCADE ON DELETE NO ACTION   -- sửa để tránh multiple cascade paths
);
GO


CREATE OR ALTER PROCEDURE sp_course_full_info
    @courseID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Thông tin khóa học + giáo viên
    SELECT 
        c.courseID,
        c.courseName,
        c.courseType,
        c.courseDes,
        c.courseDate,
        c.coursePrice,
        c.courseStatus,
        c.courseImage,
        u.userID AS teacherID,
        u.userName AS teacherName,
        u.Email AS teacherEmail
    FROM COURSE c
    INNER JOIN USER_TABLE u ON c.teacherID = u.userID
    WHERE c.courseID = @courseID;

    -- 2. Danh sách học viên đăng ký
    SELECT 
        sc.userID,
        u.userName,
        u.Email,
        sc.enrollDate,
        sc.progressPercent,
        sc.isComplete,
        sc.completedDate
    FROM STUDENT_COURSE sc
    INNER JOIN USER_TABLE u ON sc.userID = u.userID
    WHERE sc.courseID = @courseID;

    -- 3. Danh sách video trong khóa học
    SELECT 
        v.videoID,
        v.videoName,
        v.videoURL,
        v.videoProgress
    FROM VIDEO_COURSE v
    WHERE v.courseID = @courseID;

    -- 4. Bài tập trong các video
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
    WHERE v.courseID = @courseID;

    -- 5. Câu hỏi trong bài tập
    SELECT 
        q.questionID,
        q.assignmentID,
        q.questionType,
        q.content,
        q.original,
        q.rewritten,
        q.questionIndex
    FROM QUESTION q
    WHERE q.assignmentID IN (
        SELECT assignmentID FROM ASSIGNMENT WHERE videoID IN (
            SELECT videoID FROM VIDEO_COURSE WHERE courseID = @courseID
        )
    );

    -- 6. Câu trả lời cho câu hỏi
    SELECT 
        a.answerID,
        a.questionID,
        a.answerText,
        a.isCorrect,
        a.answerIndex
    FROM ANSWER a
    WHERE a.questionID IN (
        SELECT questionID FROM QUESTION WHERE assignmentID IN (
            SELECT assignmentID FROM ASSIGNMENT WHERE videoID IN (
                SELECT videoID FROM VIDEO_COURSE WHERE courseID = @courseID
            )
        )
    );

    -- 7. Bình luận trong video
    SELECT 
        c.commentID,
        c.videoID,
        c.commentText,
        c.commentTime,
        u.userID,
        u.userName
    FROM COMMENTS c
    INNER JOIN USER_TABLE u ON c.userID = u.userID
    WHERE c.videoID IN (
        SELECT videoID FROM VIDEO_COURSE WHERE courseID = @courseID
    );
END
GO



CREATE OR ALTER PROCEDURE sp_get_current_user
    @userID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.userID,
        u.userName,
        u.Date_of_Birth,
        u.gender,
        u.district,
        u.province,
        u.phoneNumber,
        u.Email,
        u.Account,
        u.roleID,
        r.roleName

    FROM USER_TABLE u
    INNER JOIN ROLES r ON u.roleID = r.roleID
    WHERE u.userID = @userID;
END
GO




CREATE OR ALTER PROCEDURE sp_update_user
    @userID INT,
    @userName NVARCHAR(50),
    @Date_of_Birth DATE,
    @gender NVARCHAR(10),
    @district NVARCHAR(20),
    @province NVARCHAR(20),
    @phoneNumber CHAR(10),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE USER_TABLE
    SET userName    = @userName,
        Date_of_Birth = @Date_of_Birth,
        gender      = @gender,
        district    = @district,
        province    = @province,
        phoneNumber = @phoneNumber,
        Email       = @Email
    WHERE userID = @userID;
END
GO


CREATE OR ALTER PROCEDURE sp_enroll_course
    @userID INT,
    @courseID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra nếu đã tồn tại thì không thêm lại
    IF NOT EXISTS (SELECT 1 FROM STUDENT_COURSE WHERE userID = @userID AND courseID = @courseID)
    BEGIN
        INSERT INTO STUDENT_COURSE(userID, courseID, enrollDate, progressPercent, isComplete)
        VALUES(@userID, @courseID, GETDATE(), 0.00, 'incomplete');
    END

    -- Luôn trả về 1 để chỉ ra thành công (đã đăng ký hoặc đã tồn tại)
    SELECT 1 AS Result;
END
GO


CREATE OR ALTER PROCEDURE sp_get_user_courses
    @userID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        sc.courseID,
        c.courseName,
        c.courseType,
        c.courseDes,
        c.courseDate,
        c.coursePrice,
        c.courseStatus,
        c.courseImage,
        sc.enrollDate,
        sc.progressPercent,
        sc.isComplete,
        sc.completedDate,
        u.userName AS teacherName
    FROM STUDENT_COURSE sc
    INNER JOIN COURSE c ON sc.courseID = c.courseID
    INNER JOIN USER_TABLE u ON c.teacherID = u.userID
    WHERE sc.userID = @userID;
END
GO


    CREATE OR ALTER PROCEDURE sp_save_score
        @studentID INT,
        @courseID INT,
        @assignmentID INT,
        @subject NVARCHAR(100),
        @correct INT,
        @total INT,
        @score DECIMAL(5,2)
    AS
    BEGIN
        SET NOCOUNT ON;

        INSERT INTO SCORE(studentID, courseID, assignmentID, subject, correct, total, score, date)
        VALUES(@studentID, @courseID, @assignmentID, @subject, @correct, @total, @score, GETDATE());
    END
    GO



    CREATE OR ALTER PROCEDURE sp_get_scores
        @studentID INT
    AS
    BEGIN
        SET NOCOUNT ON;

        SELECT 
            s.scoreID,
            s.courseID,
            c.courseName,
            s.assignmentID,
            a.assignmentName,
            s.subject,
            s.correct,
            s.total,
            s.score,
            s.date
        FROM SCORE s
        INNER JOIN COURSE c ON s.courseID = c.courseID
        INNER JOIN ASSIGNMENT a ON s.assignmentID = a.assignmentID
        WHERE s.studentID = @studentID
        ORDER BY s.date DESC;
    END
    GO


CREATE OR ALTER PROCEDURE sp_change_password
    @Account VARCHAR(20),
    @OldPassword VARCHAR(20),
    @NewPassword VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM USER_TABLE WHERE Account = @Account AND Pass = @OldPassword)
    BEGIN
        UPDATE USER_TABLE
        SET Pass = @NewPassword
        WHERE Account = @Account;
    END
    ELSE
    BEGIN
        RAISERROR('Old password is incorrect', 16, 1);
    END
END
GO

CREATE OR ALTER PROCEDURE sp_add_comment
    @userID INT,
    @videoID INT,
    @commentText NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO COMMENTS(userID, videoID, commentText, commentTime)
    VALUES(@userID, @videoID, @commentText, GETDATE());

    -- Trả về ID của comment vừa thêm
    SELECT SCOPE_IDENTITY() AS NewCommentID;
END
GO



CREATE OR ALTER PROCEDURE sp_update_comment
    @commentID INT,
    @userID INT,
    @commentText NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra comment có tồn tại và thuộc về user này
    IF EXISTS (SELECT 1 FROM COMMENTS WHERE commentID = @commentID AND userID = @userID)
    BEGIN
        UPDATE COMMENTS
        SET commentText = @commentText,
            commentTime = GETDATE()
        WHERE commentID = @commentID AND userID = @userID;
    END
    ELSE
    BEGIN
        RAISERROR('Comment not found or not owned by this user', 16, 1);
    END
END
GO

GO

CREATE OR ALTER PROCEDURE sp_delete_comment
    @commentID INT,
    @userID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra comment có tồn tại và thuộc về user này
    IF EXISTS (SELECT 1 FROM COMMENTS WHERE commentID = @commentID AND userID = @userID)
    BEGIN
        DELETE FROM COMMENTS
        WHERE commentID = @commentID AND userID = @userID;
    END
    ELSE
    BEGIN
        RAISERROR('Comment not found or not owned by this user', 16, 1);
    END
END
GO



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




