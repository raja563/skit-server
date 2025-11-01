from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render

from rest_framework import generics, permissions, serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token

import uuid

from .models import (
    Person, Enquiry, QuickEnquiry,
    FacultyMember, FacultyToken,
    Syllabus, Student,
    DecideFees, DecideExamFees, DecideHostelFees, DecideTransportFees,
    DpFees, DpExamFees, DpHostelFees, DpTransportFees,
    Staff, Career
)

from .serializers import (
    PersonSerializer, LoginSerializer, EnquirySerializer, QuickEnquirySerializer,
    RegisterSerializer, UserLoginSerializer, UserSerializer,
    FacultySerializer, SyllabusSerializer, StudentSerializer,
    DecideFeesSerializer, DecideExamFeesSerializer, DecideHostelFeesSerializer, DecideTransportFeesSerializer,
    DpFeesSerializer, DpExamFeesSerializer, DpHostelFeesSerializer, DpTransportFeesSerializer,
    StaffSerializer, CareerSerializer
)


# ------------------ Auth Views ------------------

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "username": user.username, "user_id": user.id})
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class ForgetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not email or not new_password or not confirm_password:
            return Response({"error": "All fields are required"}, status=400)
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=400)

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful"})
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=404)

# ------------------ Person ------------------

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def person(request):
    if request.method == 'GET':
        objs = Person.objects.all()
        serializer = PersonSerializer(objs, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data
        email = data.get('email')
        if Person.objects.filter(email=email).exists():
            return Response({'msg': 'Email already registered!'})
        serializer = PersonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'data saved successfully !!'})
        return Response(serializer.errors)

    elif request.method in ['PUT', 'PATCH']:
        data = request.data
        obj = get_object_or_404(Person, id=data['id'])
        serializer = PersonSerializer(obj, data=data, partial=(request.method == 'PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'data updated successfully'})
        return Response(serializer.errors)

    elif request.method == 'DELETE':
        obj = get_object_or_404(Person, id=request.data['id'])
        obj.delete()
        return Response({'msg': 'person deleted'})

@api_view(['GET', 'PUT', 'DELETE'])
def personDetail(request, pk):
    person = get_object_or_404(Person, pk=pk)

    if request.method == 'GET':
        serializer = PersonSerializer(person)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = PersonSerializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'data updated !!'})
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        person.delete()
        return Response({'msg': 'data deleted !!'})

@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        return Response({'message': 'success'})
    return Response(serializer.errors)

# ------------------ Enquiry ------------------

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def enquiry(request):
    if request.method == 'POST':
        email = request.data.get('email')
        if Enquiry.objects.filter(email=email).exists():
            return Response({'msg': 'Email already registered!'})
        serializer = EnquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'data saved successfully !!'})
        return Response(serializer.errors)
    elif request.method == 'GET':
        objs = Enquiry.objects.all()
        serializer = EnquirySerializer(objs, many=True)
        return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def quick_enquiry(request):
    if request.method == 'GET':
        enquiries = QuickEnquiry.objects.all()
        serializer = QuickEnquirySerializer(enquiries, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = QuickEnquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)



# --------------------- Faculty ---------------------
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def facultyRegister(request):
    if request.method == "POST":
        data = request.data
        if FacultyMember.objects.filter(email=data.get('email')).exists():
            return Response({'msg': 'Email already registered!'}, status=400)

        data['password'] = make_password(data.get('password'))
        serializer = FacultySerializer(data=data)
        if serializer.is_valid():
            faculty = serializer.save()
            token = str(uuid.uuid4())
            FacultyToken.objects.create(faculty=faculty, key=token)
            return Response({'msg': 'Registered successfully!', 'token': token})
        return Response(serializer.errors, status=400)

    faculty = FacultyMember.objects.all()
    serializer = FacultySerializer(faculty, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def facultyLogin(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        faculty = FacultyMember.objects.get(email=email)
        if check_password(password, faculty.password):
            token_obj, _ = FacultyToken.objects.get_or_create(faculty=faculty)
            token_obj.key = str(uuid.uuid4())
            token_obj.save()
            serializer = FacultySerializer(faculty)
            return Response({'msg': 'Login successful!', 'token': token_obj.key, 'user': serializer.data})
        return Response({'error': 'Incorrect password'}, status=401)
    except FacultyMember.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)


@api_view(['POST'])
@permission_classes([AllowAny])
def facultyLogout(request):
    token = request.headers.get('Authorization')
    if token:
        token = token.replace('Token ', '')
        FacultyToken.objects.filter(key=token).delete()
        return Response({'msg': 'Logout successful!'})
    return Response({'error': 'Token not provided'}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def facultyResetPassword(request):
    try:
        faculty = FacultyMember.objects.get(email=request.data.get('email'))
        faculty.password = make_password(request.data.get('new_password'))
        faculty.save()
        return Response({'msg': 'Password reset successful!'})
    except FacultyMember.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def facultyDetailUpdateDelete(request, pk):
    try:
        faculty = FacultyMember.objects.get(pk=pk)
    except FacultyMember.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if request.method == 'GET':
        return Response(FacultySerializer(faculty).data)
    elif request.method == 'PATCH':
        serializer = FacultySerializer(faculty, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    faculty.delete()
    return Response(status=204)


# --------------------- Syllabus ---------------------
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def syllabus(request):
    if request.method == 'POST':
        serializer = SyllabusSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Data saved successfully!'}, status=201)
        return Response(serializer.errors)

    return Response(SyllabusSerializer(Syllabus.objects.all(), many=True).data)


# --------------------- Student ---------------------
@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def student(request, pk=None):
    if request.method == 'GET':
        if pk:
            return Response(StudentSerializer(Student.objects.get(pk=pk)).data)
        return Response(StudentSerializer(Student.objects.all(), many=True).data)

    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Data saved successfully!'}, status=201)
        return Response(serializer.errors)

    elif request.method == 'PATCH':
        serializer = StudentSerializer(Student.objects.get(pk=pk), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Data updated successfully!'})
        return Response(serializer.errors)

    Student.objects.get(pk=pk).delete()
    return Response({'msg': 'Deleted successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def studentLogin(request):
    try:
        student = Student.objects.get(email=request.data.get('email'), dob=request.data.get('dob'))
        return Response({'user': StudentSerializer(student).data, 'msg': 'Login successful'})
    except Student.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.http import JsonResponse
from .models import Attendance, AttendanceRecord, Student
from .serializers import AttendanceSerializer, AttendanceRecordSerializer
import base64
import numpy as np
import cv2
from deepface import DeepFace

# ----------------------------------------
# 1️⃣ Attendance Session List / Create View
# ----------------------------------------
class AttendanceListCreateView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all().order_by('-date')
    serializer_class = AttendanceSerializer

from datetime import datetime
from django.utils import timezone
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer


class AttendanceRecordListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = AttendanceRecord.objects.all().select_related('student')
    serializer_class = AttendanceRecordSerializer

    def perform_create(self, serializer):
        student = serializer.validated_data.get('student')
        current_date = timezone.localdate()
        current_time = datetime.now().time()

        # 🔍 Check if student already has an attendance record today
        record = AttendanceRecord.objects.filter(student=student, date=current_date).first()

        if record:
            # ✅ If only Time In marked, mark Time Out
            if not record.time_out:
                record.time_out = current_time
                record.save()
                print(f"✅ Time Out marked for {student.name} at {current_time}")
            else:
                # 🚫 Both times already marked
                raise serializers.ValidationError({
                    "detail": f"Attendance already marked for {student.name} on {current_date}."
                })
        else:
            # ✅ First time marking attendance → create with Time In only
            serializer.save(
                student=student,
                date=current_date,
                time_in=current_time,
                status="Present",
                verified_by_face=True,
            )
            print(f"✅ Time In marked for {student.name} at {current_time}")

# ----------------------------------------
# 3️⃣ Face Recognition Attendance API
# ----------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def mark_attendance(request):
    """
    Face Recognition Attendance:
    ✅ Uses optimized face detection
    ✅ Displays real system time (HH:MM:SS AM/PM)
    ✅ Provides clear messages
    ✅ Prevents duplicate daily entries
    """
    try:
        # Step 1️⃣: Validate image data
        image_data = request.data.get("image")
        if not image_data:
            return Response({"status": "fail", "message": "Image is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Step 2️⃣: Decode base64 image safely
        image_data = image_data.split(",")[-1]
        decoded_image = base64.b64decode(image_data)
        np_data = np.frombuffer(decoded_image, np.uint8)
        frame = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        if frame is None:
            return Response({
                "status": "fail",
                "message": "Invalid or corrupted image data. Please try again."
            }, status=status.HTTP_400_BAD_REQUEST)

        # Step 3️⃣: Detect face (faster backend for speed)
        try:
            face_objs = DeepFace.extract_faces(
                frame, detector_backend='ssd', enforce_detection=False
            )
        except Exception as e:
            print("⚠️ DeepFace detection error:", e)
            face_objs = []

        if not face_objs:
            return Response({
                "status": "fail",
                "message": "No face detected. Please face the camera properly."
            }, status=status.HTTP_400_BAD_REQUEST)

        input_face = frame

        # Step 4️⃣: Match face with stored student images
        students = Student.objects.exclude(image__isnull=True).exclude(image__exact='')
        best_match = None
        best_score = 0.0

        for student in students:
            try:
                result = DeepFace.verify(
                    img1_path=input_face,
                    img2_path=student.image.path,
                    model_name="Facenet512",
                    detector_backend="ssd",
                    enforce_detection=False,
                    distance_metric="cosine"
                )
                confidence = 1 - result.get("distance", 1.0)

                if confidence > best_score:
                    best_score = confidence
                    best_match = student
            except Exception as e:
                print(f"⚠️ Error verifying {student.name}: {e}")
                continue

        # Step 5️⃣: Validate match confidence
        if not best_match or best_score < 0.55:
            return Response({
                "status": "fail",
                "message": "Face not recognized. Try again with better lighting or angle.",
                "confidence": round(float(best_score), 3)
            }, status=status.HTTP_400_BAD_REQUEST)
        # Assuming 'from django.utils import timezone' is imported at the top of the file
        # Assuming 'status' and 'Response' are imported from rest_framework

        # 1. Get the current local, timezone-aware datetime object
        current_datetime = timezone.localtime(timezone.now())
        today = current_datetime.date()
        initial_status = "Half Day"

        # Create a formatted time string for the message only (not for database assignment)
        formatted_time = current_datetime.strftime("%I:%M:%S %p")

        # 2. Perform the atomic operation
        record, created = AttendanceRecord.objects.get_or_create(
            student=best_match,
            date=today,
            defaults={
                "status": initial_status,
                "time_in": current_datetime, # ✅ Correct: Assigns datetime object
                "verified_by_face": True,
                "confidence_score": float(best_score),
                "time_out": None,             # ✅ Correct: Explicitly set to None
            },
        )

        # 3. Step 7️⃣: Update message and handle second marking
        if created:
            message = f"✅ Welcome {best_match.name}! Time In marked at {formatted_time}."
        elif not record.time_out:
            # 💥 FIX APPLIED HERE: Must assign a datetime object to record.time_out
            record.time_out = current_datetime 
            record.save(update_fields=["time_out", "status"]) # Ensure status update is handled elsewhere if needed
            
            # NOTE: You should calculate the final status (e.g., "Present") here 
            # based on time_in and time_out, and add "status" to update_fields.
            
            message = f"✅ Goodbye {best_match.name}! Time Out marked at {formatted_time}."
        else:
            # --- Third time marking -> Show success/thanks message only ---
            message = f"✅ Thank you, {best_match.name}! Your attendance is already completed for today."

        # 4. Step 8️⃣: Return JSON response
        return Response({
            "status": "success",
            "message": message,
            "student_id": best_match.student_id,
            "confidence": round(float(best_score), 3),
            # Use the formatted string for the time in the response payload for clean API output
            "time": formatted_time, 
            "student": {
                "name": best_match.name,
                "course": best_match.course,
                "session": best_match.session,
            }
        }, status=status.HTTP_200_OK)

        # ... The exception handling block remains the same ...

    except Exception as e:
        print("💥 Error in mark_attendance:", e)
        return Response({
            "status": "fail",
            "message": "Internal error occurred while marking attendance.",
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from django.http import JsonResponse
from .models import Student

def get_student_pk(request):
    """
    Fetch student primary key (id) by their student_id or roll_no.
    Example: /api/get-student-pk/?student_id=KAM25007
    """
    student_id = request.GET.get("student_id")
    roll_no = request.GET.get("roll_no")

    if not student_id and not roll_no:
        return JsonResponse({"error": "Missing student_id or roll_no parameter"}, status=400)

    try:
        if student_id:
            student = Student.objects.get(student_id=student_id)
        else:
            student = Student.objects.get(roll_no=roll_no)

        return JsonResponse({
            "pk": student.pk,
            "student_id": student.student_id,
            "name": student.name
        })
    except Student.DoesNotExist:
        return JsonResponse({"error": "Student not found"}, status=404)


# --------------------- Decide Fees ---------------------
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def decideFees(request):
    if request.method == 'POST':
        serializer = DecideFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Fees deposited successfully!'}, status=201)
        return Response(serializer.errors)

    return Response(DecideFeesSerializer(DecideFees.objects.all(), many=True).data)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def decideExamFees(request):
    if request.method == 'POST':
        serializer = DecideExamFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Fees deposited successfully!'}, status=201)
        return Response(serializer.errors)

    return Response(DecideExamFeesSerializer(DecideExamFees.objects.all(), many=True).data)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def decideHostelFees(request):
    if request.method == 'POST':
        serializer = DecideHostelFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Fees deposited successfully!'}, status=201)
        return Response(serializer.errors)

    return Response(DecideHostelFeesSerializer(DecideHostelFees.objects.all(), many=True).data)


@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def decideTransportFees(request):
    if request.method == 'POST':
        serializer = DecideTransportFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Fees deposited successfully!'}, status=201)
        return Response(serializer.errors)

    return Response(DecideTransportFeesSerializer(DecideTransportFees.objects.all(), many=True).data)


# --------------------- Deposit Fees ---------------------
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def dpfees_list_create(request):
    if request.method == 'POST':
        serializer = DpFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)

    return Response(DpFeesSerializer(DpFees.objects.all().order_by('-created_at'), many=True).data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def dpfees_detail(request, pk):
    dpfees = get_object_or_404(DpFees, pk=pk)
    if request.method == 'GET':
        return Response(DpFeesSerializer(dpfees).data)
    elif request.method == 'PATCH':
        serializer = DpFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    dpfees.delete()
    return Response(status=204)


# Similar view functions for dpExamFees, dpHostelFees, dpTransportFees below...

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def dpexamfees(request):
    if request.method == 'POST':
        serializer = DpExamFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
    return Response(DpExamFeesSerializer(DpExamFees.objects.all().order_by('-created_at'), many=True).data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def dpexamfees_detail(request, pk):
    dpfees = get_object_or_404(DpExamFees, pk=pk)
    if request.method == 'GET':
        return Response(DpExamFeesSerializer(dpfees).data)
    elif request.method == 'PATCH':
        serializer = DpExamFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    dpfees.delete()
    return Response(status=204)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def dp_hostel(request):
    if request.method == 'POST':
        serializer = DpHostelFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
    return Response(DpHostelFeesSerializer(DpHostelFees.objects.all().order_by('-created_at'), many=True).data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def dp_hostel_detail(request, pk):
    dpfees = get_object_or_404(DpHostelFees, pk=pk)
    if request.method == 'GET':
        return Response(DpHostelFeesSerializer(dpfees).data)
    elif request.method == 'PATCH':
        serializer = DpHostelFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    dpfees.delete()
    return Response(status=204)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def dp_transport(request):
    if request.method == 'POST':
        serializer = DpTransportFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
    return Response(DpTransportFeesSerializer(DpTransportFees.objects.all().order_by('-created_at'), many=True).data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def dp_transport_detail(request, pk):
    dpfees = get_object_or_404(DpTransportFees, pk=pk)
    if request.method == 'GET':
        return Response(DpTransportFeesSerializer(dpfees).data)
    elif request.method == 'PATCH':
        serializer = DpTransportFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    dpfees.delete()
    return Response(status=204)


# --------------------- Staff ---------------------
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def staff_list_create(request):
    if request.method == 'POST':
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
    return Response(StaffSerializer(Staff.objects.all(), many=True).data)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def staff_detail(request, pk):
    try:
        staff = Staff.objects.get(pk=pk)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff not found'}, status=404)

    if request.method == 'GET':
        return Response(StaffSerializer(staff).data)
    elif request.method == 'PATCH':
        serializer = StaffSerializer(staff, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    staff.delete()
    return Response({'message': 'Staff deleted'}, status=204)


# --------------------- Career ---------------------
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([AllowAny])
def career_list(request):
    if request.method == 'POST':
        serializer = CareerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)

    elif request.method == 'DELETE':
        count = Career.objects.all().delete()
        return Response({'message': f'{count[0]} careers deleted successfully.'}, status=204)

    return Response(CareerSerializer(Career.objects.all().order_by('-applied_on'), many=True).data)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def career_detail(request, pk):
    try:
        career = Career.objects.get(pk=pk)
    except Career.DoesNotExist:
        return Response({'error': 'Career not found'}, status=404)

    if request.method == 'GET':
        return Response(CareerSerializer(career).data)
    career.delete()
    return Response({'message': 'Career deleted successfully'}, status=204)
