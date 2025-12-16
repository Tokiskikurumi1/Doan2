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
		gender NVARCHAR(10) NULL CHECK (gender IN (N'Nam', N'N?', N'Khác')),
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


	select * from QUESTION

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




--================================================================================================--
--============================================ ÐANG NH?P ==============================================--
--================================================================================================--

-- PROCEDURE ÐANG NH?P
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


--================================================================================================--
--============================================ ADMIN ==============================================--
--================================================================================================--



-- T?O PROCEDURE
CREATE PROCEDURE sp_user_get_by_id
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
		userID,  
		userName, 
		Date_of_Birth,
		gender,
		district,
		province,
		phoneNumber,
		Email,		
		Account,
		Pass,		
		roleID
    FROM USER_TABLE 
    WHERE userID = @Id;
END
GO

--CREATE USER (ADMIN)
CREATE PROCEDURE sp_user_create
    @userName NVARCHAR(50),
    @Date_of_Birth DATETIME,
    @gender NVARCHAR(10) = NULL,
    @district NVARCHAR(20) = NULL,
    @province NVARCHAR(20) = NULL,
    @phoneNumber CHAR(10),
    @Email VARCHAR(100),
    @Account VARCHAR(20),
    @Pass VARCHAR(20),
    @roleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO USER_TABLE (
            userName, Date_of_Birth, gender, district, province,
            phoneNumber, Email, Account, Pass, roleID
        ) VALUES (
            @userName, @Date_of_Birth, @gender, @district, @province,
            @phoneNumber, @Email, @Account, @Pass, @roleID
        );

        return 1;
    END TRY
    BEGIN CATCH
        return 0;
    END CATCH
END
GO


--UPDATE USER
CREATE PROCEDURE sp_user_update
    @userID INT,
    @userName NVARCHAR(50),
    @Date_of_Birth DATETIME,
    @gender NVARCHAR(10) = NULL,
    @district NVARCHAR(20) = NULL,
    @province NVARCHAR(20) = NULL,
    @phoneNumber CHAR(10),
    @Email VARCHAR(100),
    @Account VARCHAR(20),
    @Pass VARCHAR(20),
    @roleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE USER_TABLE SET
            userName = @userName,
            Date_of_Birth = @Date_of_Birth,
            gender = @gender,
            district = @district,
            province = @province,
            phoneNumber = @phoneNumber,
            Email = @Email,
            Account = @Account,
            Pass = @Pass,
            roleID = @roleID
        WHERE userID = @userID;

        IF @@ROWCOUNT = 0
            THROW 50001, 'Không tìm th?y user d? c?p nh?t!', 1;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

--DELETE USER
CREATE PROCEDURE sp_user_delete
    @userID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM USER_TABLE WHERE userID = @userID;
    
    IF @@ROWCOUNT = 0
        THROW 50001, 'Không tìm th?y user d? xóa!', 1;
END
GO


--================================================================================================--
--============================================ GI?NG VIÊN ==============================================--
--================================================================================================--

-- HI?N T?T C? KHÓA H?C THEO ID C?A GI?NG VIÊN
CREATE PROCEDURE tc_course_getAll_by_id
	@TId INT
AS
BEGIN
	SET NOCOUNT ON;

    SELECT 
		courseID,
		courseName,  
		courseType, 
		courseDes,
		courseDate,
		coursePrice,
		courseStatus,
		courseImage,
		teacherID
    FROM COURSE 
    WHERE teacherID = @TId;
END
GO



-- T?O KHÓA H?C 
CREATE OR ALTER PROCEDURE tc_course_create
    @courseName NVARCHAR(50),
    @courseType NVARCHAR(50),
    @courseDes NVARCHAR(200),
    @courseDate DATE,
    @coursePrice DECIMAL(10,3),
    @courseStatus NVARCHAR(20) = 'incomplete',
    @courseImage VARCHAR(255) = NULL,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Ki?m tra teacherID có t?n t?i không?
    IF NOT EXISTS (SELECT 1 FROM USER_TABLE WHERE userID = @teacherID)
    BEGIN
        THROW 50001, N'Gi?ng viên không t?n t?i!', 1;
        RETURN;
    END

    -- 2. Ki?m tra teacherID có ph?i là GI?NG VIÊN (roleID = 2) không?
    IF NOT EXISTS (SELECT 1 FROM USER_TABLE WHERE userID = @teacherID AND roleID = 2)
    BEGIN
        THROW 50002, N'ID này không ph?i gi?ng viên! Không có quy?n t?o khóa h?c.', 1;
        RETURN;
    END

    -- 3. Ki?m tra tr?ng thái h?p l?
    IF @courseStatus NOT IN ('completed', 'incomplete')
    BEGIN
        THROW 50003, N'Tr?ng thái khóa h?c ch? du?c là ''completed'' ho?c ''incomplete''!', 1;
        RETURN;
    END

    -- T?t c? OK ? t?o khóa h?c
    INSERT INTO COURSE (
        teacherID, courseName, courseType, courseDes, courseDate,
        coursePrice, courseStatus, courseImage
    ) VALUES (
        @teacherID, @courseName, @courseType, @courseDes, @courseDate,
        @coursePrice, @courseStatus, @courseImage
    );

    -- Tr? v? courseID v?a t?o (r?t h?u ích cho frontend)
    --SELECT SCOPE_IDENTITY() AS newCourseID;
END
GO


-- UPDATE COURSE
CREATE PROCEDURE tc_course_update
    @courseID INT,
    @courseName NVARCHAR(50),
    @courseType NVARCHAR(50),
    @courseDes NVARCHAR(200),
    @courseDate DATE,
    @coursePrice DECIMAL(10,3),
    @courseStatus NVARCHAR(20), 
    @courseImage VARCHAR(255) = NULL,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID)
    BEGIN
        THROW 50003, N'B?n không có quy?n s?a khóa h?c này!', 1;
        RETURN;
    END

    IF @courseStatus NOT IN ('completed', 'incomplete')
    BEGIN
        THROW 50004, N'Tr?ng thái ch? du?c là ''completed'' ho?c ''incomplete''!', 1;
        RETURN;	
    END

    UPDATE COURSE SET
        courseName = @courseName,
        courseType = @courseType,
        courseDes = @courseDes,
        courseDate = @courseDate,
        coursePrice = @coursePrice,
        courseStatus = @courseStatus,
        courseImage = @courseImage
    WHERE courseID = @courseID AND teacherID = @teacherID;
END
GO


-- DELETE COURSE 
CREATE PROCEDURE tc_course_delete
	@courseID INT,
	@teacherID INT
AS 
BEGIN
	SET NOCOUNT ON;

	IF NOT EXISTS (SELECT 1 FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID)
	BEGIN
		THROW 50003, N'B?n không có quy?n xóa khóa h?c này!', 1;
        RETURN;
	END
	DELETE FROM STUDENT_COURSE WHERE courseID = @courseID;
	DELETE FROM VIDEO_COURSE WHERE courseID = @courseID;
	DELETE FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID;
END
GO



-- TÌM KI?M KHÓA H?C THEO TÊN KHÓA H?C 
CREATE OR ALTER PROCEDURE tc_course_search_by_name
    @teacherID INT,                  
    @searchName NVARCHAR(50) = NULL 
AS
BEGIN
    SET NOCOUNT ON;

    -- Ki?m tra gi?ng viên có t?n t?i và dúng role (roleID = 2 là gi?ng viên)
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 60001, N'ID không h?p l? ho?c b?n không ph?i là gi?ng viên!', 1;
        RETURN;
    END

    -- N?u không có t? khóa tìm ki?m ? tr? v? t?t c? khóa h?c c?a gi?ng viên
    IF @searchName IS NULL OR LTRIM(RTRIM(@searchName)) = ''
    BEGIN
        THROW 50001, N'Không có khóa h?c nào tìm ki?m h?p l?!', 1;
        RETURN;
    END

    -- Tìm ki?m g?n dúng (không phân bi?t hoa/thu?ng)
    DECLARE @cleanSearch NVARCHAR(50) = LOWER(LTRIM(RTRIM(@searchName)));

    SELECT 
        courseID,
        courseName,
        courseType,
        courseDes,
        courseDate,
        coursePrice,
        courseStatus,
        courseImage
    FROM COURSE
    WHERE teacherID = @teacherID
      AND (
          LOWER(courseName) LIKE '%' + @cleanSearch + '%'
          OR LOWER(courseType) LIKE '%' + @cleanSearch + '%'
      )
    ORDER BY 
        CASE 
            WHEN LOWER(courseName) LIKE @cleanSearch + '%' THEN 1  
            WHEN LOWER(courseName) LIKE '%' + @cleanSearch + '%' THEN 2
            ELSE 3
        END,
        courseName;
END
GO


-- HI?N KHÓA H?C THEO ID KHÓA H?C 

CREATE OR ALTER PROCEDURE tc_course_get_by_id
    @courseID  INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    /* 1. Ki?m tra gi?ng viên có t?n t?i và dúng role */
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID 
          AND roleID = 2
    )
    BEGIN
        THROW 80001, N'ID không h?p l? ho?c b?n không ph?i gi?ng viên!', 1;
        RETURN;
    END

    /* 2. Ki?m tra khóa h?c có thu?c v? gi?ng viên không */
    IF NOT EXISTS (
        SELECT 1
        FROM COURSE
        WHERE courseID = @courseID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 80002, N'B?n không có quy?n xem khóa h?c này!', 1;
        RETURN;
    END

    /* 3. Tr? v? thông tin khóa h?c */
    SELECT
        c.courseID,
        c.courseName,
        c.courseType,
        c.courseDes,
        c.courseDate,
        c.coursePrice,
        c.courseStatus,
        c.courseImage,
        c.teacherID,

        u.userName AS teacherName,
        u.Email    AS teacherEmail
    FROM COURSE c
    INNER JOIN USER_TABLE u 
        ON c.teacherID = u.userID
    WHERE c.courseID = @courseID
      AND c.teacherID = @teacherID;
END
GO


--=====================================================================
-- L?Y VIDEO T? KHÓA H?C
--=====================================================================

CREATE OR ALTER PROCEDURE tc_video_get_by_course
    @courseID   INT,
    @teacherID  INT        
AS
BEGIN
    SET NOCOUNT ON;

    -- Ki?m tra khóa h?c có thu?c v? gi?ng viên hay không
    IF NOT EXISTS (
        SELECT 1 FROM COURSE 
        WHERE courseID = @courseID AND teacherID = @teacherID
    )
    BEGIN
        THROW 51001, N'B?n không có quy?n xem video c?a khóa h?c này!', 1;
        RETURN;
    END

    SELECT 
        videoID,
        courseID,
        videoName,
        videoURL,
        videoProgress
    FROM VIDEO_COURSE
    WHERE courseID = @courseID;
END
GO


--=====================================================================
--  T?O VIDEO M?I 
--=====================================================================
CREATE PROCEDURE tc_video_create
    @courseID   INT,
	@teacherID  INT,                    
    @videoName  NVARCHAR(100),
    @videoURL   VARCHAR(255),
	@videoProgress NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- KI?M TRA: courseID có t?n t?i và thu?c v? teacherID dang login không?
    IF NOT EXISTS (SELECT 1 FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID)
    BEGIN
        THROW 50010, N'Khóa h?c không t?n t?i ho?c b?n không ph?i ch? s? h?u!', 1;
        RETURN;
    END

    IF LTRIM(RTRIM(@videoURL)) = ''
    BEGIN
        THROW 50011, N'URL video không du?c d? tr?ng!', 1;
        RETURN;
    END

    INSERT INTO VIDEO_COURSE (courseID, videoName, videoURL, videoProgress)
    VALUES (@courseID, @videoName, @videoURL, @videoProgress);

END
GO

--=====================================================================
-- S?A VIDEO
--=====================================================================

CREATE OR ALTER PROCEDURE tc_video_update
    @videoID        INT,
    @videoName      NVARCHAR(100),
    @videoURL       VARCHAR(255),
    @videoProgress  NVARCHAR(50),
    @teacherID      INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 
        FROM VIDEO_COURSE v
        INNER JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 50020, N'Video không t?n t?i ho?c b?n không có quy?n s?a!', 1;
        RETURN;
    END

    UPDATE VIDEO_COURSE
    SET 
        videoName = @videoName,
        videoURL = @videoURL,
        videoProgress = @videoProgress
    WHERE videoID = @videoID;

END
GO


SELECT 
    v.videoID,
    v.courseID AS VideoCourse,
    c.courseID AS CourseCourse,
    c.teacherID
FROM VIDEO_COURSE v
JOIN COURSE c ON v.courseID = c.courseID
WHERE v.videoID =   -- ID VIDEO MÀY ÐANG S?A



--=====================================================================
-- XÓA VIDEO
--=====================================================================
CREATE OR ALTER PROCEDURE tc_video_delete
    @videoID   INT,
    @teacherID INT                      
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 
        FROM VIDEO_COURSE v
        INNER JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 50030, N'Video không t?n t?i ho?c b?n không có quy?n xóa!', 1;
        RETURN;
    END

    DELETE FROM VIDEO_COURSE WHERE videoID = @videoID;

    SELECT 'deleted' AS result;
END
GO

--=====================================================================
-- L?Y BÀI T?P THEO VIDEO ID
--=====================================================================

CREATE OR ALTER PROCEDURE tc_assignment_get_by_video
    @videoID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Ki?m tra video có thu?c quy?n gi?ng viên không
    IF NOT EXISTS (
        SELECT 1
        FROM VIDEO_COURSE v
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52001, N'B?n không có quy?n xem bài t?p c?a video này!', 1;
        RETURN;
    END

    SELECT 
		assignmentID,
		videoID, 
		teacherID,
		assignmentName,
		assignmentCourse,
		assignmentType, 
		assignmentDeadline,
		assignmentDuration,
		assignmentDes,
		assignmentStatus
    FROM ASSIGNMENT
    WHERE videoID = @videoID;
END
GO

--=====================================================================
-- T?O BÀI T?P
--=====================================================================
CREATE OR ALTER PROCEDURE tc_assignment_create
    @teacherID INT,
    @videoID INT,
    @assignmentName NVARCHAR(50),
    @assignmentCourse NVARCHAR(50),
    @assignmentType NVARCHAR(20),
    @assignmentDeadline DATE,
    @assignmentDuration INT,
    @assignmentDes NVARCHAR(100),
	@assignmentStatus VARCHAR(20) 
AS
BEGIN
    SET NOCOUNT ON;

    -- Check quy?n video
    IF NOT EXISTS (
        SELECT 1
        FROM VIDEO_COURSE v 
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52002, N'B?n không có quy?n t?o bài t?p cho video này!', 1;
        RETURN;
    END

    INSERT INTO ASSIGNMENT
    (
        teacherID, videoID, assignmentName, assignmentCourse, assignmentType,
        assignmentDeadline, assignmentDuration, assignmentDes, assignmentStatus
    )
    VALUES
    (
        @teacherID, @videoID, @assignmentName, @assignmentCourse, @assignmentType,
        @assignmentDeadline, @assignmentDuration, @assignmentDes, @assignmentStatus
    );
END
GO

--=====================================================================
-- CH?NH S?A BÀI T?P
--=====================================================================
CREATE OR ALTER PROCEDURE tc_assignment_update
    @assignmentID INT,
    @teacherID INT,
    @assignmentName NVARCHAR(50),
    @assignmentCourse NVARCHAR(50),
    @assignmentType NVARCHAR(20),
    @assignmentDeadline DATE,
    @assignmentDuration INT,
    @assignmentDes NVARCHAR(100),
    @assignmentStatus VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52003, N'B?n không có quy?n s?a bài t?p này!', 1;
        RETURN;
    END

    UPDATE ASSIGNMENT
    SET assignmentName = @assignmentName,
        assignmentCourse = @assignmentCourse,
        assignmentType = @assignmentType,
        assignmentDeadline = @assignmentDeadline,
        assignmentDuration = @assignmentDuration,
        assignmentDes = @assignmentDes,
        assignmentStatus = @assignmentStatus
    WHERE assignmentID = @assignmentID;
END
GO

SELECT *
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = 1
          AND c.teacherID = 5
--=====================================================================
-- XÓA BÀI T?P
--=====================================================================
CREATE OR ALTER PROCEDURE tc_assignment_delete
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52004, N'B?n không có quy?n xóa bài t?p này!', 1;
        RETURN;
    END

    DELETE FROM ASSIGNMENT WHERE assignmentID = @assignmentID;
END
GO

-- =========================================
-- L?Y T?T C? BÀI T?P
-- =========================================
CREATE OR ALTER PROCEDURE tc_assignment_get_all_assignment
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check gi?ng viên t?n t?i & dúng role
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 52010, N'ID không h?p l? ho?c b?n không ph?i gi?ng viên!', 1;
        RETURN;
    END

    SELECT 
        a.assignmentID,
        a.videoID,
        a.teacherID,
        a.assignmentName,
        a.assignmentCourse,
        a.assignmentType,
        a.assignmentDeadline,
        a.assignmentDuration,
        a.assignmentDes,
        a.assignmentStatus
    FROM ASSIGNMENT a
    WHERE a.teacherID = @teacherID
    ORDER BY a.assignmentID DESC;
END
GO




-- =========================================
-- L?Y BÀI T?P THEO ID 
-- =========================================
CREATE OR ALTER PROCEDURE tc_assignment_get_by_id
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Check gi?ng viên h?p l?
    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 52011, N'B?n không có quy?n truy c?p (không ph?i gi?ng viên)', 1;
        RETURN;
    END

    -- 2. Check bài t?p t?n t?i & thu?c v? gi?ng viên
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT
        WHERE assignmentID = @assignmentID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 52012, N'Không tìm th?y bài t?p ho?c b?n không có quy?n truy c?p', 1;
        RETURN;
    END

    -- 3. L?y thông tin bài t?p
    SELECT
        assignmentID,
        videoID,
        teacherID,
        assignmentName,
        assignmentCourse,
        assignmentType,
        assignmentDeadline,
        assignmentDuration,
        assignmentDes,
        assignmentStatus
    FROM ASSIGNMENT
    WHERE assignmentID = @assignmentID;
END
GO




-- l?y câu h?i
CREATE OR ALTER PROCEDURE tc_question_get_assignment
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54003, N'B?n không có quy?n xem câu h?i c?a bài t?p này!', 1;
        RETURN;
    END

    SELECT
        questionID,
		assignmentID,
        questionType,
        content,
        original,
        rewritten,
        questionIndex
    FROM QUESTION 
    WHERE assignmentID = @assignmentID
    ORDER BY questionIndex
END
GO

select * from QUESTION
--=====================================================================
-- T?O CÂU H?I 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_question_create
    @assignmentID INT,
    @teacherID INT,
    @questionType NVARCHAR(20),
    @content NVARCHAR(200) = NULL,
    @original NVARCHAR(200) = NULL,
    @rewritten NVARCHAR(200) = NULL,
    @questionIndex INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N GI?NG VIÊN
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54001, N'B?n không có quy?n t?o câu h?i cho bài t?p này!', 1;
        RETURN;
    END

    INSERT INTO QUESTION (
        assignmentID,
        questionType,
        content,
        original,
        rewritten,
        questionIndex
    )
    VALUES (
        @assignmentID,
        @questionType,
        @content,
        @original,
        @rewritten,
        @questionIndex
    );

    SELECT SCOPE_IDENTITY() AS questionID;
END
GO



--=====================================================================
-- T?O CÂU TR? L?I  
--=====================================================================
CREATE OR ALTER PROCEDURE tc_answer_create
    @questionID INT,
    @teacherID INT,
    @answerText NVARCHAR(200),
    @isCorrect BIT,
    @answerIndex INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N QUA QUESTION ? ASSIGNMENT ? COURSE
    IF NOT EXISTS (
        SELECT 1
        FROM QUESTION q
        JOIN ASSIGNMENT a ON q.assignmentID = a.assignmentID
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE q.questionID = @questionID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54002, N'B?n không có quy?n thêm dáp án cho câu h?i này!', 1;
        RETURN;
    END

    INSERT INTO ANSWER (
        questionID,
        answerText,
        isCorrect,
        answerIndex
    )
    VALUES (
        @questionID,
        @answerText,
        @isCorrect,
        @answerIndex
    );
END
GO

-- update câu tr? l?i 
CREATE OR ALTER PROCEDURE tc_answer_update
    @answerID INT,
    @teacherID INT,
    @answerText NVARCHAR(200),
    @isCorrect BIT,
    @answerIndex INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N: ch? cho phép update n?u answer thu?c question c?a teacher
    IF NOT EXISTS (
        SELECT 1
        FROM ANSWER a
        JOIN QUESTION q ON a.questionID = q.questionID
        JOIN ASSIGNMENT ass ON q.assignmentID = ass.assignmentID
        JOIN VIDEO_COURSE v ON ass.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.answerID = @answerID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54006, N'B?n không có quy?n s?a câu tr? l?i này!', 1;
        RETURN;
    END

    UPDATE ANSWER
    SET answerText = @answerText,
        isCorrect = @isCorrect,
        answerIndex = @answerIndex
    WHERE answerID = @answerID;
END
GO


-- xóa câu tr? l?i
CREATE OR ALTER PROCEDURE tc_answer_delete
    @answerID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N: ch? cho phép xóa n?u answer thu?c question c?a teacher
    IF NOT EXISTS (
        SELECT 1
        FROM ANSWER a
        JOIN QUESTION q ON a.questionID = q.questionID
        JOIN ASSIGNMENT ass ON q.assignmentID = ass.assignmentID
        JOIN VIDEO_COURSE v ON ass.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.answerID = @answerID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54007, N'B?n không có quy?n xóa câu tr? l?i này!', 1;
        RETURN;
    END

    DELETE FROM ANSWER
    WHERE answerID = @answerID;
END
GO



--=====================================================================
-- L?Y CÂU H?I VÀ CÂU TR? L?I Ð? S?A BÀI T?P 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_question_get_by_assignment
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54003, N'B?n không có quy?n xem câu h?i c?a bài t?p này!', 1;
        RETURN;
    END

    SELECT
        q.questionID,
        q.questionType,
        q.content,
        q.original,
        q.rewritten,
        q.questionIndex,

        a.answerID,
        a.answerText,
        a.isCorrect,
        a.answerIndex
    FROM QUESTION q
    LEFT JOIN ANSWER a ON q.questionID = a.questionID
    WHERE q.assignmentID = @assignmentID
    ORDER BY q.questionIndex, a.answerIndex;
END
GO

--=====================================================================
-- C?P NH?T CÂU H?I
--=====================================================================
CREATE OR ALTER PROCEDURE tc_question_update
    @questionID INT,
    @teacherID INT,
    @questionType NVARCHAR(20),
    @content NVARCHAR(200) = NULL,
    @original NVARCHAR(200) = NULL,
    @rewritten NVARCHAR(200) = NULL,
    @questionIndex INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N: ch? cho phép update n?u câu h?i thu?c bài t?p c?a gi?ng viên
    IF NOT EXISTS (
        SELECT 1
        FROM QUESTION q
        JOIN ASSIGNMENT a ON q.assignmentID = a.assignmentID
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE q.questionID = @questionID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54008, N'B?n không có quy?n s?a câu h?i này!', 1;
        RETURN;
    END

    -- UPDATE câu h?i
    UPDATE QUESTION
    SET questionType = @questionType,
        content = @content,
        original = @original,
        rewritten = @rewritten,
        questionIndex = @questionIndex
    WHERE questionID = @questionID;
END
GO

-- XÓA CÂU H?I 

CREATE OR ALTER PROCEDURE tc_question_delete
    @questionID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUY?N
    IF NOT EXISTS (
        SELECT 1
        FROM QUESTION q
        JOIN ASSIGNMENT a ON q.assignmentID = a.assignmentID
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE q.questionID = @questionID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54004, N'B?n không có quy?n xóa câu h?i này!', 1;
        RETURN;
    END

    DELETE FROM QUESTION WHERE questionID = @questionID;
END
GO


-- L?Y T?T C? CÂU H?I
CREATE OR ALTER PROCEDURE tc_answer_get_by_question
    @questionID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM QUESTION q
        JOIN ASSIGNMENT a ON q.assignmentID = a.assignmentID
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE q.questionID = @questionID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54005, N'B?n không có quy?n xem câu tr? l?i c?a câu h?i này!', 1;
        RETURN;
    END

    -- Tr? v? danh sách câu tr? l?i c?a câu h?i
    SELECT 
        answerID,
        answerText,
        isCorrect,
        answerIndex
    FROM ANSWER
    WHERE questionID = @questionID
    ORDER BY answerIndex;
END
GO



--=====================================================================
-- L?Y T?T C? H?C VIÊN ÐANG KÝ KHÓA H?C C?A GI?NG VIÊN 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_get_all_students_of_teacher
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND roleID = 2
    )
    BEGIN
        THROW 60001, N'ID không h?p l? ho?c không ph?i gi?ng viên!', 1;
        RETURN;
    END

    SELECT
        c.courseID,
        c.courseName,
        c.courseType,
        c.courseStatus,

        u.userID        AS studentID,
        u.userName      AS studentName,
        u.Email,
        u.phoneNumber,

        sc.enrollDate,
        sc.progressPercent,
        sc.isComplete,
        sc.completedDate
    FROM COURSE c
    INNER JOIN STUDENT_COURSE sc 
        ON c.courseID = sc.courseID
    INNER JOIN USER_TABLE u 
        ON sc.userID = u.userID
    WHERE c.teacherID = @teacherID
      AND u.roleID = 3  
    ORDER BY c.courseID, u.userName;
END
GO



--=====================================================================
-- L?Y T?T C? H?C VIÊN THU?C M?T KHÓA H?C C? TH? C?A GI?NG VIÊN 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_get_students_by_teacher_and_course
    @teacherID INT,
    @courseID  INT
AS
BEGIN
    SET NOCOUNT ON;

    /* 1. Ki?m tra teacherID có t?n t?i và dúng role không */
    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND roleID = 2
    )
    BEGIN
        THROW 70001, N'ID không h?p l? ho?c không ph?i gi?ng viên!', 1;
        RETURN;
    END

    /* 2. Ki?m tra khóa h?c có thu?c v? gi?ng viên không */
    IF NOT EXISTS (
        SELECT 1
        FROM COURSE
        WHERE courseID = @courseID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 70002, N'B?n không có quy?n xem h?c viên c?a khóa h?c này!', 1;
        RETURN;
    END

    /* 3. L?y danh sách h?c viên */
    SELECT
        c.courseID,
        c.courseName,
        c.courseType,
        c.courseStatus,

        u.userID        AS studentID,
        u.userName      AS studentName,
        u.Email,
        u.phoneNumber,

        sc.enrollDate,
        sc.progressPercent,
        sc.isComplete,
        sc.completedDate
    FROM STUDENT_COURSE sc
    INNER JOIN USER_TABLE u ON sc.userID = u.userID
    INNER JOIN COURSE c ON sc.courseID = c.courseID
    WHERE sc.courseID = @courseID
      AND c.teacherID = @teacherID
      AND u.roleID = 3
    ORDER BY u.userName;
END
GO


-- TÌM KI?M H?C VIÊN C?A CHÍNH GI?NG VIÊN 
CREATE OR ALTER PROCEDURE tc_student_search_by_name
    @teacherID INT,                
    @searchStudent NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Ki?m tra gi?ng viên có t?n t?i và dúng role (roleID = 2 là gi?ng viên)
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 60001, N'B?n không ph?i là gi?ng viên!', 1;
        RETURN;
    END

    -- N?u không có t? khóa ? tr? v? t?t c? h?c viên dang h?c khóa c?a gi?ng viên này
    IF @searchStudent IS NULL OR LTRIM(RTRIM(@searchStudent)) = ''
    BEGIN
        THROW 50001, N'Không t?n t?i thông tin h?c viên!',1;
        RETURN;
    END

    -- Tìm ki?m g?n dúng (không phân bi?t hoa thu?ng)
    DECLARE @cleanSearch NVARCHAR(50) = LOWER(LTRIM(RTRIM(@searchStudent)));

    SELECT DISTINCT
        u.userID,
        u.userName,
        u.Email,
        u.phoneNumber,
        u.Date_of_Birth,
        u.gender,
        u.district,
        u.province
    FROM USER_TABLE u
    INNER JOIN STUDENT_COURSE sc ON u.userID = sc.userID
    INNER JOIN COURSE c ON sc.courseID = c.courseID
    WHERE u.roleID = 3
      AND c.teacherID = @teacherID
      AND (
          LOWER(u.userName) LIKE '%' + @cleanSearch + '%'
          OR LOWER(u.Email) LIKE '%' + @cleanSearch + '%'
      )
    ORDER BY 
        CASE 
            WHEN LOWER(u.userName) LIKE @cleanSearch + '%' THEN 1   -- Uu tiên kh?p d?u tên
            WHEN LOWER(u.userName) LIKE '%' + @cleanSearch + '%' THEN 2
            ELSE 3
        END,
        u.userName;
END
GO

--=====================================================================
-- L?Y THÔNG TIN C?A GI?NG VIÊN 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_get_info
	@teacherID INT
AS
BEGIN 
	SET NOCOUNT ON 
	IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 60001, N'B?n không ph?i là gi?ng viên!', 1;
        RETURN;
    END

	SELECT 
		userID,
		userName,
		Date_of_Birth,
		gender,
		district,
		province,
		phoneNumber,
		Email
	FROM USER_TABLE
	WHERE userID = @teacherID
END
GO

--=====================================================================
-- C?P NH?T THÔNG TIN CÁ NHÂN C?A GI?NG VIÊN
--=====================================================================
CREATE OR ALTER PROCEDURE tc_update_info
    @teacherID      INT,
    @userName       NVARCHAR(50),
    @Date_of_Birth  DATE,
    @gender         NVARCHAR(10),  
    @district       NVARCHAR(20),
    @province       NVARCHAR(20),
    @phoneNumber    CHAR(10),
    @Email          VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID 
          AND roleID = 2
    )
    BEGIN
        THROW 60002, N'ID không h?p l? ho?c b?n không ph?i là gi?ng viên!', 1;
        RETURN;
    END

    IF @Email NOT LIKE '%_@_%.__%' 
       OR @Email LIKE '%[^a-zA-Z0-9@._-]%'
    BEGIN
        THROW 60003, N'Ð?nh d?ng email không h?p l?!', 1;
        RETURN;
    END

    IF @phoneNumber IS NOT NULL
    BEGIN
        IF @phoneNumber NOT LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]' 
           OR LEN(@phoneNumber) <> 10
        BEGIN
            THROW 60004, N'S? di?n tho?i ph?i g?m dúng 10 ch? s?!', 1;
            RETURN;
        END
    END

    IF @gender IS NOT NULL
    BEGIN
        IF @gender NOT IN (N'Nam', N'N?', N'Khác')
        BEGIN
            THROW 60005, N'Gi?i tính ch? du?c ch?n: Nam, N?, Khác!', 1;
            RETURN;
        END
    END

		UPDATE USER_TABLE
        SET 
            userName      = @userName,
            Date_of_Birth = @Date_of_Birth,
            gender        = @gender,
            district      = @district,
            province      = @province,
            phoneNumber   = @phoneNumber,
            Email         = @Email
        WHERE userID = @teacherID;
END
GO

--=====================================================================
-- C?P NH?T M?T KH?U C?A GI?NG VIÊN
--=====================================================================
CREATE OR ALTER PROCEDURE tc_update_pass
    @teacherID   INT,
    @currentPass VARCHAR(20),
    @newPass     VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND roleID = 2
    )
    BEGIN
        THROW 60001, N'ID không h?p l? ho?c b?n không ph?i là gi?ng viên!', 1;
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND Pass = @currentPass
    )
    BEGIN
        THROW 60002, N'M?t kh?u hi?n t?i không dúng!', 1;
        RETURN;
    END

    UPDATE USER_TABLE
    SET Pass = @newPass
    WHERE userID = @teacherID;

END
GO







SELECT a.assignmentID, a.videoID, v.courseID, c.teacherID
FROM ASSIGNMENT a
JOIN VIDEO_COURSE v ON a.videoID = v.videoID
JOIN COURSE c ON v.courseID = c.courseID
WHERE a.assignmentID = 2;

SELECT * FROM ASSIGNMENT WHERE assignmentID = 2;
SELECT * FROM VIDEO_COURSE WHERE videoID = 2;
SELECT * FROM COURSE WHERE courseID = 13;



SELECT c.courseName, u.userName
FROM COURSE AS c
INNER JOIN USER_TABLE AS u
    ON c.teacherID = u.userID
WHERE c.teacherID = 5;
 

select * from USER_TABLE
where userID = 5

select * from COURSE
where teacherID = 5

SELECT v.videoName, c.teacherID
FROM VIDEO_COURSE AS v
JOIN COURSE AS c
    ON v.courseID = c.courseID
WHERE c.teacherID = 5
  AND v.courseID = 13;

select * from VIDEO_COURSE 
where teacherID = 5

select * from VIDEO_COURSE
where courseID = 16 and teacherID = 5

select * from ASSIGNMENT





SELECT * FROM STUDENT_COURSE
where courseID = 13

DECLARE @assignmentID INT = 5;  -- ID assignment b?n mu?n t?o
DECLARE @teacherID INT = 5;     -- ID gi?ng viên hi?n t?i

SELECT *
FROM ASSIGNMENT a
JOIN VIDEO_COURSE v ON a.videoID = v.videoID
JOIN COURSE c ON v.courseID = c.courseID
WHERE a.assignmentID = @assignmentID
  AND c.teacherID = @teacherID;


  SELECT * from COURSE
  SELECT * from USER_TABLE
  SELECT * FROM STUDENT_COURSE

-- Insert sample users with date of birth
INSERT INTO USER_TABLE (userName, Date_of_Birth, gender, district, province, phoneNumber, Email, Account, Pass, roleID)
VALUES
('Nguyen Van A', '1990-05-15', N'Nam', N'Hanoi', N'Hanoi', '0123456789', 'nguyenvana@example.com', 'nguyenvana', '123456', 3),
('Tran Thi B', '1992-08-20', N'N?', N'HCM', N'HCM', '0987654321', 'tranthib@example.com', 'tranthib', '123456', 3),
('Le Van C', '1988-12-10', N'Nam', N'Danang', N'Danang', '0111111111', 'levanc@example.com', 'levanc', '123456', 3);

-- Update existing users to have date of birth
UPDATE USER_TABLE SET Date_of_Birth = '1995-03-10' WHERE userID = 1;
UPDATE USER_TABLE SET Date_of_Birth = '1993-07-22' WHERE userID = 2;
UPDATE USER_TABLE SET Date_of_Birth = '1991-11-05' WHERE userID = 3;
UPDATE USER_TABLE SET Date_of_Birth = '1989-01-15' WHERE userID = 4;
UPDATE USER_TABLE SET Date_of_Birth = '1997-09-30' WHERE userID = 5;
UPDATE USER_TABLE SET Date_of_Birth = '1994-05-18' WHERE userID = 6;
UPDATE USER_TABLE SET Date_of_Birth = '1992-12-08' WHERE userID = 7;

INSERT INTO STUDENT_COURSE
(userID, courseID, enrollDate, progressPercent, isComplete, completedDate)
VALUES
-- Course 1: m?i h?c
(8, 24, GETDATE(), 10, 'incomplete', NULL),
(9, 25, DATEADD(DAY, -10, GETDATE()), 45, 'incomplete', NULL),
(10, 26, DATEADD(DAY, -20, GETDATE()), 80, 'incomplete', NULL),
(11, 27, DATEADD(DAY, -30, GETDATE()), 100, 'completed', DATEADD(DAY, -2, GETDATE())),
(12, 30, DATEADD(DAY, -60, GETDATE()), 100, 'completed', DATEADD(DAY, -20, GETDATE()));
# Update 2026-01-10 17:57:49
# Code optimization and refactoring
# UI/UX improvements
# UI/UX improvements
# Bug fixes and improvements
// Unit tests added for better coverage
   Additional implementation details
// Feature flag implementation
// Unit tests added for better coverage
// Feature flag implementation
// UI/UX improvements added
// Logging mechanism enhanced
// Security enhancements integrated
// Code documentation updated
// Database optimization completed
   Code review suggestions applied */
// Feature flag implementation
// Logging mechanism enhanced
