	CREATE DATABASE LMS;
	GO

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


--================================================================================================--
--============================================ ADMIN ==============================================--
--================================================================================================--



-- TẠO PROCEDURE
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
            THROW 50001, 'Không tìm thấy user để cập nhật!', 1;
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
        THROW 50001, 'Không tìm thấy user để xóa!', 1;
END
GO


--================================================================================================--
--============================================ GIẢNG VIÊN ==============================================--
--================================================================================================--

-- HIỆN TẤT CẢ KHÓA HỌC THEO ID CỦA GIẢNG VIÊN
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



-- TẠO KHÓA HỌC 
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

    -- 1. Kiểm tra teacherID có tồn tại không?
    IF NOT EXISTS (SELECT 1 FROM USER_TABLE WHERE userID = @teacherID)
    BEGIN
        THROW 50001, N'Giảng viên không tồn tại!', 1;
        RETURN;
    END

    -- 2. Kiểm tra teacherID có phải là GIẢNG VIÊN (roleID = 2) không?
    IF NOT EXISTS (SELECT 1 FROM USER_TABLE WHERE userID = @teacherID AND roleID = 2)
    BEGIN
        THROW 50002, N'ID này không phải giảng viên! Không có quyền tạo khóa học.', 1;
        RETURN;
    END

    -- 3. Kiểm tra trạng thái hợp lệ
    IF @courseStatus NOT IN ('completed', 'incomplete')
    BEGIN
        THROW 50003, N'Trạng thái khóa học chỉ được là ''completed'' hoặc ''incomplete''!', 1;
        RETURN;
    END

    -- Tất cả OK → tạo khóa học
    INSERT INTO COURSE (
        teacherID, courseName, courseType, courseDes, courseDate,
        coursePrice, courseStatus, courseImage
    ) VALUES (
        @teacherID, @courseName, @courseType, @courseDes, @courseDate,
        @coursePrice, @courseStatus, @courseImage
    );

    -- Trả về courseID vừa tạo (rất hữu ích cho frontend)
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
        THROW 50003, N'Bạn không có quyền sửa khóa học này!', 1;
        RETURN;
    END

    IF @courseStatus NOT IN ('completed', 'incomplete')
    BEGIN
        THROW 50004, N'Trạng thái chỉ được là ''completed'' hoặc ''incomplete''!', 1;
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
		THROW 50003, N'Bạn không có quyền xóa khóa học này!', 1;
        RETURN;
	END
	DELETE FROM STUDENT_COURSE WHERE courseID = @courseID;
	DELETE FROM VIDEO_COURSE WHERE courseID = @courseID;
	DELETE FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID;
END
GO



-- TÌM KIẾM KHÓA HỌC THEO TÊN KHÓA HỌC 
CREATE OR ALTER PROCEDURE tc_course_search_by_name
    @teacherID INT,                  
    @searchName NVARCHAR(50) = NULL 
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra giảng viên có tồn tại và đúng role (roleID = 2 là giảng viên)
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 60001, N'ID không hợp lệ hoặc bạn không phải là giảng viên!', 1;
        RETURN;
    END

    -- Nếu không có từ khóa tìm kiếm → trả về tất cả khóa học của giảng viên
    IF @searchName IS NULL OR LTRIM(RTRIM(@searchName)) = ''
    BEGIN
        THROW 50001, N'Không có khóa học nào tìm kiếm hợp lệ!', 1;
        RETURN;
    END

    -- Tìm kiếm gần đúng (không phân biệt hoa/thường)
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


-- HIỆN KHÓA HỌC THEO ID KHÓA HỌC 

CREATE OR ALTER PROCEDURE tc_course_get_by_id
    @courseID  INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    /* 1. Kiểm tra giảng viên có tồn tại và đúng role */
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID 
          AND roleID = 2
    )
    BEGIN
        THROW 80001, N'ID không hợp lệ hoặc bạn không phải giảng viên!', 1;
        RETURN;
    END

    /* 2. Kiểm tra khóa học có thuộc về giảng viên không */
    IF NOT EXISTS (
        SELECT 1
        FROM COURSE
        WHERE courseID = @courseID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 80002, N'Bạn không có quyền xem khóa học này!', 1;
        RETURN;
    END

    /* 3. Trả về thông tin khóa học */
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
-- LẤY VIDEO TỪ KHÓA HỌC
--=====================================================================

CREATE OR ALTER PROCEDURE tc_video_get_by_course
    @courseID   INT,
    @teacherID  INT        
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra khóa học có thuộc về giảng viên hay không
    IF NOT EXISTS (
        SELECT 1 FROM COURSE 
        WHERE courseID = @courseID AND teacherID = @teacherID
    )
    BEGIN
        THROW 51001, N'Bạn không có quyền xem video của khóa học này!', 1;
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
--  TẠO VIDEO MỚI 
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

    -- KIỂM TRA: courseID có tồn tại và thuộc về teacherID đang login không?
    IF NOT EXISTS (SELECT 1 FROM COURSE WHERE courseID = @courseID AND teacherID = @teacherID)
    BEGIN
        THROW 50010, N'Khóa học không tồn tại hoặc bạn không phải chủ sở hữu!', 1;
        RETURN;
    END

    IF LTRIM(RTRIM(@videoURL)) = ''
    BEGIN
        THROW 50011, N'URL video không được để trống!', 1;
        RETURN;
    END

    INSERT INTO VIDEO_COURSE (courseID, videoName, videoURL, videoProgress)
    VALUES (@courseID, @videoName, @videoURL, @videoProgress);

END
GO

--=====================================================================
-- SỬA VIDEO
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
        THROW 50020, N'Video không tồn tại hoặc bạn không có quyền sửa!', 1;
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
WHERE v.videoID =   -- ID VIDEO MÀY ĐANG SỬA



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
        THROW 50030, N'Video không tồn tại hoặc bạn không có quyền xóa!', 1;
        RETURN;
    END

    DELETE FROM VIDEO_COURSE WHERE videoID = @videoID;

    SELECT 'deleted' AS result;
END
GO

--=====================================================================
-- LẤY BÀI TẬP THEO VIDEO ID
--=====================================================================

CREATE OR ALTER PROCEDURE tc_assignment_get_by_video
    @videoID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra video có thuộc quyền giảng viên không
    IF NOT EXISTS (
        SELECT 1
        FROM VIDEO_COURSE v
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52001, N'Bạn không có quyền xem bài tập của video này!', 1;
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
-- TẠO BÀI TẬP
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

    -- Check quyền video
    IF NOT EXISTS (
        SELECT 1
        FROM VIDEO_COURSE v 
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE v.videoID = @videoID AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 52002, N'Bạn không có quyền tạo bài tập cho video này!', 1;
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
-- CHỈNH SỬA BÀI TẬP
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
        THROW 52003, N'Bạn không có quyền sửa bài tập này!', 1;
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
-- XÓA BÀI TẬP
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
        THROW 52004, N'Bạn không có quyền xóa bài tập này!', 1;
        RETURN;
    END

    DELETE FROM ASSIGNMENT WHERE assignmentID = @assignmentID;
END
GO

-- =========================================
-- LẤY TẤT CẢ BÀI TẬP
-- =========================================
CREATE OR ALTER PROCEDURE tc_assignment_get_all_assignment
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check giảng viên tồn tại & đúng role
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 52010, N'ID không hợp lệ hoặc bạn không phải giảng viên!', 1;
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
-- LẤY BÀI TẬP THEO ID 
-- =========================================
CREATE OR ALTER PROCEDURE tc_assignment_get_by_id
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Check giảng viên hợp lệ
    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 52011, N'Bạn không có quyền truy cập (không phải giảng viên)', 1;
        RETURN;
    END

    -- 2. Check bài tập tồn tại & thuộc về giảng viên
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT
        WHERE assignmentID = @assignmentID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 52012, N'Không tìm thấy bài tập hoặc bạn không có quyền truy cập', 1;
        RETURN;
    END

    -- 3. Lấy thông tin bài tập
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




-- lấy câu hỏi
CREATE OR ALTER PROCEDURE tc_question_get_assignment
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUYỀN
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54003, N'Bạn không có quyền xem câu hỏi của bài tập này!', 1;
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
-- TẠO CÂU HỎI 
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

    -- CHECK QUYỀN GIẢNG VIÊN
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54001, N'Bạn không có quyền tạo câu hỏi cho bài tập này!', 1;
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
-- TẠO CÂU TRẢ LỜI  
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

    -- CHECK QUYỀN QUA QUESTION → ASSIGNMENT → COURSE
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
        THROW 54002, N'Bạn không có quyền thêm đáp án cho câu hỏi này!', 1;
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

-- update câu trả lời 
CREATE OR ALTER PROCEDURE tc_answer_update
    @answerID INT,
    @teacherID INT,
    @answerText NVARCHAR(200),
    @isCorrect BIT,
    @answerIndex INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUYỀN: chỉ cho phép update nếu answer thuộc question của teacher
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
        THROW 54006, N'Bạn không có quyền sửa câu trả lời này!', 1;
        RETURN;
    END

    UPDATE ANSWER
    SET answerText = @answerText,
        isCorrect = @isCorrect,
        answerIndex = @answerIndex
    WHERE answerID = @answerID;
END
GO


-- xóa câu trả lời
CREATE OR ALTER PROCEDURE tc_answer_delete
    @answerID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUYỀN: chỉ cho phép xóa nếu answer thuộc question của teacher
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
        THROW 54007, N'Bạn không có quyền xóa câu trả lời này!', 1;
        RETURN;
    END

    DELETE FROM ANSWER
    WHERE answerID = @answerID;
END
GO



--=====================================================================
-- LẤY CÂU HỎI VÀ CÂU TRẢ LỜI ĐỂ SỬA BÀI TẬP 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_question_get_by_assignment
    @assignmentID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUYỀN
    IF NOT EXISTS (
        SELECT 1
        FROM ASSIGNMENT a
        JOIN VIDEO_COURSE v ON a.videoID = v.videoID
        JOIN COURSE c ON v.courseID = c.courseID
        WHERE a.assignmentID = @assignmentID
          AND c.teacherID = @teacherID
    )
    BEGIN
        THROW 54003, N'Bạn không có quyền xem câu hỏi của bài tập này!', 1;
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
-- CẬP NHẬT CÂU HỎI
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

    -- CHECK QUYỀN: chỉ cho phép update nếu câu hỏi thuộc bài tập của giảng viên
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
        THROW 54008, N'Bạn không có quyền sửa câu hỏi này!', 1;
        RETURN;
    END

    -- UPDATE câu hỏi
    UPDATE QUESTION
    SET questionType = @questionType,
        content = @content,
        original = @original,
        rewritten = @rewritten,
        questionIndex = @questionIndex
    WHERE questionID = @questionID;
END
GO

-- XÓA CÂU HỎI 

CREATE OR ALTER PROCEDURE tc_question_delete
    @questionID INT,
    @teacherID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- CHECK QUYỀN
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
        THROW 54004, N'Bạn không có quyền xóa câu hỏi này!', 1;
        RETURN;
    END

    DELETE FROM QUESTION WHERE questionID = @questionID;
END
GO


-- LẤY TẤT CẢ CÂU HỎI
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
        THROW 54005, N'Bạn không có quyền xem câu trả lời của câu hỏi này!', 1;
        RETURN;
    END

    -- Trả về danh sách câu trả lời của câu hỏi
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
-- LẤY TẤT CẢ HỌC VIÊN ĐĂNG KÝ KHÓA HỌC CỦA GIẢNG VIÊN 
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
        THROW 60001, N'ID không hợp lệ hoặc không phải giảng viên!', 1;
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
-- LẤY TẤT CẢ HỌC VIÊN THUỘC MỘT KHÓA HỌC CỤ THỂ CỦA GIẢNG VIÊN 
--=====================================================================
CREATE OR ALTER PROCEDURE tc_get_students_by_teacher_and_course
    @teacherID INT,
    @courseID  INT
AS
BEGIN
    SET NOCOUNT ON;

    /* 1. Kiểm tra teacherID có tồn tại và đúng role không */
    IF NOT EXISTS (
        SELECT 1
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND roleID = 2
    )
    BEGIN
        THROW 70001, N'ID không hợp lệ hoặc không phải giảng viên!', 1;
        RETURN;
    END

    /* 2. Kiểm tra khóa học có thuộc về giảng viên không */
    IF NOT EXISTS (
        SELECT 1
        FROM COURSE
        WHERE courseID = @courseID
          AND teacherID = @teacherID
    )
    BEGIN
        THROW 70002, N'Bạn không có quyền xem học viên của khóa học này!', 1;
        RETURN;
    END

    /* 3. Lấy danh sách học viên */
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


-- TÌM KIẾM HỌC VIÊN CỦA CHÍNH GIẢNG VIÊN 
CREATE OR ALTER PROCEDURE tc_student_search_by_name
    @teacherID INT,                
    @searchStudent NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Kiểm tra giảng viên có tồn tại và đúng role (roleID = 2 là giảng viên)
    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE 
        WHERE userID = @teacherID AND roleID = 2
    )
    BEGIN
        THROW 60001, N'Bạn không phải là giảng viên!', 1;
        RETURN;
    END

    -- Nếu không có từ khóa → trả về tất cả học viên đang học khóa của giảng viên này
    IF @searchStudent IS NULL OR LTRIM(RTRIM(@searchStudent)) = ''
    BEGIN
        THROW 50001, N'Không tồn tại thông tin học viên!',1;
        RETURN;
    END

    -- Tìm kiếm gần đúng (không phân biệt hoa thường)
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
            WHEN LOWER(u.userName) LIKE @cleanSearch + '%' THEN 1   -- Ưu tiên khớp đầu tên
            WHEN LOWER(u.userName) LIKE '%' + @cleanSearch + '%' THEN 2
            ELSE 3
        END,
        u.userName;
END
GO

--=====================================================================
-- LẤY THÔNG TIN CỦA GIẢNG VIÊN 
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
        THROW 60001, N'Bạn không phải là giảng viên!', 1;
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
-- CẬP NHẬT THÔNG TIN CÁ NHÂN CỦA GIẢNG VIÊN
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
        THROW 60002, N'ID không hợp lệ hoặc bạn không phải là giảng viên!', 1;
        RETURN;
    END

    IF @Email NOT LIKE '%_@_%.__%' 
       OR @Email LIKE '%[^a-zA-Z0-9@._-]%'
    BEGIN
        THROW 60003, N'Định dạng email không hợp lệ!', 1;
        RETURN;
    END

    IF @phoneNumber IS NOT NULL
    BEGIN
        IF @phoneNumber NOT LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]' 
           OR LEN(@phoneNumber) <> 10
        BEGIN
            THROW 60004, N'Số điện thoại phải gồm đúng 10 chữ số!', 1;
            RETURN;
        END
    END

    IF @gender IS NOT NULL
    BEGIN
        IF @gender NOT IN (N'Nam', N'Nữ', N'Khác')
        BEGIN
            THROW 60005, N'Giới tính chỉ được chọn: Nam, Nữ, Khác!', 1;
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
-- CẬP NHẬT MẬT KHẨU CỦA GIẢNG VIÊN
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
        THROW 60001, N'ID không hợp lệ hoặc bạn không phải là giảng viên!', 1;
        RETURN;
    END

    IF NOT EXISTS (
        SELECT 1 
        FROM USER_TABLE
        WHERE userID = @teacherID
          AND Pass = @currentPass
    )
    BEGIN
        THROW 60002, N'Mật khẩu hiện tại không đúng!', 1;
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

DECLARE @assignmentID INT = 5;  -- ID assignment bạn muốn tạo
DECLARE @teacherID INT = 5;     -- ID giảng viên hiện tại

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
('Tran Thi B', '1992-08-20', N'Nữ', N'HCM', N'HCM', '0987654321', 'tranthib@example.com', 'tranthib', '123456', 3),
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
-- Course 1: mới học
(8, 24, GETDATE(), 10, 'incomplete', NULL),
(9, 25, DATEADD(DAY, -10, GETDATE()), 45, 'incomplete', NULL),
(10, 26, DATEADD(DAY, -20, GETDATE()), 80, 'incomplete', NULL),
(11, 27, DATEADD(DAY, -30, GETDATE()), 100, 'completed', DATEADD(DAY, -2, GETDATE())),
(12, 30, DATEADD(DAY, -60, GETDATE()), 100, 'completed', DATEADD(DAY, -20, GETDATE()));
