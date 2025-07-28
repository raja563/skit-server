from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes


from home.models import Person, Enquiry
from .serializers import PersonSerializer, LoginSerializer, EnquirySerializer, FacultySerializer

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, UserLoginSerializer, UserSerializer
from django.contrib.auth import authenticate

# ✅ REGISTER
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# ✅ LOGIN
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "user_id": user.id,
            })
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
    
# ✅ LOGOUT
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

# ✅ GET ALL USERS (NO AUTH REQUIRED)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# ✅ DELETE USER (WITH AUTH)
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# ✅ FORGET PASSWORD (Reset Directly If Email Matches)
class ForgetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not email or not new_password or not confirm_password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

# Create your views here.
@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def person(request):
    if request.method == 'GET':
        objs = Person.objects.all()
        serializer = PersonSerializer(objs, many = True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        data = request.data
        email = data.get('email')

    # Check if email already exists
        serializer = PersonSerializer(data = data)
        if Person.objects.filter(email=email).exists():
            return Response({'msg': 'Email already registered!'})
        
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'data saved successfully !!'})
        
        return Response(serializer.errors)
    
    # elif request.method == 'PUT':
    #     data = request.data
    #     obj = Person.objects.get(id = data['id'])
    #     serializer = PersonSerializer(obj, data = data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
        
    #     return Response(serializer.errors)
    

    # elif request.method == 'PATCH':
    #     data = request.data
    #     obj = Person.objects.get(id = data['id'])
    #     serializer = PersonSerializer(obj, data = data, partial=True)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
        
    #     return Response(serializer.errors)

    else:
        data = request.data
        obj = Person.objects.get(id = data['id'])
        obj.delete()
        return Response({'message':'person deleted'})




@api_view(['GET', 'PUT', 'DELETE'])
def personDetail(request, pk):
        try:
             person = Person.objects.get(pk = pk)
        except:
             return Response(status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            serializer = PersonSerializer(person)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif request.method == 'DELETE':
             person.delete()
             return Response({'msg':'data deleted !!'})


        elif request.method == 'PUT':
            data = request.data
            serializer = PersonSerializer(person, data = request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({'msg':'data updated !!'})
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
     data = request.data
     serializer = LoginSerializer(data = data)

     if serializer.is_valid():
          data = serializer.validated_data
          return Response({'message':'success'})
     return Response(serializer.errors)

@api_view(['POST','GET'])
@permission_classes([AllowAny])
def enquiry(request):
     if request.method == 'POST':
        
        data = request.data
        email = data.get('email')
        serializer = EnquirySerializer(data = data)
        if Enquiry.objects.filter(email=email).exists():
            return Response({'msg': 'Email already registered!'})
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'data saved successfully !!'})
            
        return Response(serializer.errors)
     if request.method == 'GET':
        objs = Enquiry.objects.all()
        serializers = EnquirySerializer(objs, many = True)
        return Response(serializers.data)

from .serializers import QuickEnquirySerializer
from .models import QuickEnquiry
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def quick_enquiry(request):
    if request.method == 'GET':
        enquiries = QuickEnquiry.objects.all()
        serializer = QuickEnquirySerializer(enquiries, many=True)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = QuickEnquirySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import FacultyMember, FacultyToken
from .serializers import FacultySerializer
from django.contrib.auth.hashers import make_password, check_password
import uuid

# ✅ Register
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def facultyRegister(request):
    if request.method == "POST":
        data = request.data
        email = data.get('email')
        if FacultyMember.objects.filter(email=email).exists():
            return Response({'msg': 'Email already registered!'}, status=400)

        data['password'] = make_password(data.get('password'))
        serializer = FacultySerializer(data=data)
        if serializer.is_valid():
            faculty = serializer.save()
            token = str(uuid.uuid4())
            FacultyToken.objects.create(faculty=faculty, key=token)
            return Response({'msg': 'Registered successfully!', 'token': token})
        return Response(serializer.errors, status=400)

    if request.method == 'GET':
        faculty = FacultyMember.objects.all()
        serializer = FacultySerializer(faculty, many=True)
        return Response(serializer.data)

# ✅ Login
@api_view(['POST'])
def facultyLogin(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        faculty = FacultyMember.objects.get(email=email)
        if check_password(password, faculty.password):
            token_obj, created = FacultyToken.objects.get_or_create(faculty=faculty)
            if not created:
                token_obj.key = str(uuid.uuid4())  # regenerate token
                token_obj.save()
            serializer = FacultySerializer(faculty)
            return Response({'msg': 'Login successful!', 'token': token_obj.key, 'user': serializer.data})
        else:
            return Response({'error': 'Incorrect password'}, status=401)
    except FacultyMember.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=401)

# ✅ Logout
@api_view(['POST'])
def facultyLogout(request):
    token = request.headers.get('Authorization')
    if token:
        try:
            token = token.replace('Token ', '')
            FacultyToken.objects.get(key=token).delete()
            return Response({'msg': 'Logout successful!'})
        except FacultyToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=400)
    return Response({'error': 'Token not provided'}, status=400)

# ✅ Reset Password
@api_view(['POST'])
def facultyResetPassword(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    try:
        faculty = FacultyMember.objects.get(email=email)
        faculty.password = make_password(new_password)
        faculty.save()
        return Response({'msg': 'Password reset successful!'})
    except FacultyMember.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)


@api_view(['GET', 'PATCH', 'DELETE'])
def facultyDetailUpdateDelete(request, pk):
    try:
        faculty = FacultyMember.objects.get(pk=pk)
    except FacultyMember.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    if request.method == 'GET':
        serializer = FacultySerializer(faculty)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = FacultySerializer(faculty, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        faculty.delete()
        return Response(status=204)

# syllabus 

from .serializers import SyllabusSerializer
from .models import Syllabus

@api_view(["POST","GET"])
def syllabus(request):
    if request.method == 'POST':
        data = request.data
        serializer = SyllabusSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'data saved successfully !!!'})
        return Response(serializer.errors)
    if request.method == 'GET':
         objs = Syllabus.objects.all()
         serializer = SyllabusSerializer(objs, many = True)
         return Response(serializer.data)






from .models import Student
from .serializers import StudentSerializer

# student view 
@api_view(['POST', 'GET'])
def student(request):
    if request.method == "POST":
        data = request.data
        # email = data.get('email')
        serializer = StudentSerializer(data = data)
        # if Student.objects.filter(email=email).exists():
            # return Response({'msg': 'Email already registered!'})
        if serializer.is_valid():
            serializer.save()
            return Response({'msg' : 'data saved successfully !!'})
        return Response(serializer.errors)
    if request.method == 'GET':
        objs = Student.objects.all()
        serializer = StudentSerializer(objs, many = True)
        return Response(serializer.data)
    
# views.py
@api_view(['GET', 'POST', 'PATCH', 'DELETE'])
def student(request, pk=None):
    if request.method == 'GET':
        if pk:
            obj = Student.objects.get(pk=pk)
            serializer = StudentSerializer(obj)
            return Response(serializer.data)
        objs = Student.objects.all()
        serializer = StudentSerializer(objs, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Data saved successfully!'})
        return Response(serializer.errors)

    if request.method == 'PATCH':
        obj = Student.objects.get(pk=pk)
        serializer = StudentSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg': 'Data updated successfully!'})
        return Response(serializer.errors)

    if request.method == 'DELETE':
        obj = Student.objects.get(pk=pk)
        obj.delete()
        return Response({'msg': 'Deleted successfully'})


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer

@api_view(['POST'])
def studentLogin(request):
    email = request.data.get('email')
    dob = request.data.get('dob')

    if not email or not dob:
        return Response({'error': 'Email and Date of Birth are required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        student = Student.objects.get(email=email, dob=dob)
        serializer = StudentSerializer(student)
        return Response({
            'user': serializer.data,
            'msg': 'Login successful'
        }, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# decide academics fee view 
from .serializers import DecideFeesSerializer
from .models import DecideFees
@api_view(['POST','GET'])
def decideFees(request):
    if request.method =='POST':
        data = request.data
        serializers =DecideFeesSerializer(data = data)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':'fees deposited successfully !!'})
        return Response(serializers.errors)   
    if request.method == 'GET':
        objs = DecideFees.objects.all()
        serializers = DecideFeesSerializer(objs, many = True)
        return Response(serializers.data)


# decide exam fees view 
from .serializers import DecideExamFeesSerializer
from .models import DecideExamFees
@api_view(['POST','GET'])
def decideExamFees(request):
    if request.method =='POST':
        data = request.data
        serializers =DecideExamFeesSerializer(data = data)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':'fees deposited successfully !!'})
        return Response(serializers.errors)   
    if request.method == 'GET':
        objs = DecideExamFees.objects.all()
        serializers = DecideExamFeesSerializer(objs, many = True)
        return Response(serializers.data)
# decide hostel fees view 
from .serializers import DecideHostelFeesSerializer
from .models import DecideHostelFees
@api_view(['POST','GET'])
def decideHostelFees(request):
    if request.method =='POST':
        data = request.data
        serializers =DecideHostelFeesSerializer(data = data)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':'fees deposited successfully !!'})
        return Response(serializers.errors)   
    if request.method == 'GET':
        objs = DecideHostelFees.objects.all()
        serializers = DecideHostelFeesSerializer(objs, many = True)
        return Response(serializers.data)

# decide transport fees view 
from .serializers import DecideTransportFeesSerializer
from .models import DecideTransportFees
@api_view(['POST','GET'])
def decideTransportFees(request):
    if request.method =='POST':
        data = request.data
        serializers =DecideTransportFeesSerializer(data = data)
        if serializers.is_valid():
            serializers.save()
            return Response({'msg':'fees deposited successfully !!'})
        return Response(serializers.errors)   
    if request.method == 'GET':
        objs = DecideTransportFees.objects.all()
        serializers = DecideTransportFeesSerializer(objs, many = True)
        return Response(serializers.data)



from .models import DpFees
from .serializers import DpFeesSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def dpfees_list_create(request):
    if request.method == 'GET':
        fees = DpFees.objects.all().order_by('-created_at')
        serializer = DpFeesSerializer(fees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DpFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def dpfees_detail(request, pk):
    dpfees = get_object_or_404(DpFees, pk=pk)

    if request.method == 'GET':
        serializer = DpFeesSerializer(dpfees)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DpFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dpfees.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# deposite exam fees view 
from .models import DpExamFees
from .serializers import DpExamFeesSerializer

@api_view(['GET', 'POST'])
def dpexamfees(request):
    if request.method == 'GET':
        fees = DpExamFees.objects.all().order_by('-created_at')
        serializer = DpExamFeesSerializer(fees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DpExamFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def dpexamfees_detail(request, pk):
    dpfees = get_object_or_404(DpFees, pk=pk)

    if request.method == 'GET':
        serializer = DpExamFeesSerializer(dpfees)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DpExamFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dpfees.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# deposite hostel fee
from .models import DpHostelFees
from .serializers import DpHostelFeesSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def dp_hostel(request):
    if request.method == 'GET':
        fees = DpHostelFees.objects.all().order_by('-created_at')
        serializer = DpHostelFeesSerializer(fees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DpHostelFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def dp_hostel_detail(request, pk):
    dpfees = get_object_or_404(DpHostelFees, pk=pk)

    if request.method == 'GET':
        serializer = DpHostelFeesSerializer(dpfees)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DpHostelFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dpfees.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# deposite transport fee
from .models import DpTransportFees
from .serializers import DpTransportFeesSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def dp_transport(request):
    if request.method == 'GET':
        fees = DpTransportFees.objects.all().order_by('-created_at')
        serializer = DpTransportFeesSerializer(fees, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DpTransportFeesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def dp_transport_detail(request, pk):
    dpfees = get_object_or_404(DpTransportFees, pk=pk)

    if request.method == 'GET':
        serializer = DpTransportFeesSerializer(dpfees)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DpTransportFeesSerializer(dpfees, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        dpfees.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Staff
from .serializers import StaffSerializer

@api_view(['GET', 'POST'])
def staff_list_create(request):
    if request.method == 'GET':
        staff = Staff.objects.all()
        serializer = StaffSerializer(staff, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])  # ✅ Added PATCH here
def staff_detail(request, pk):
    try:
        staff = Staff.objects.get(pk=pk)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StaffSerializer(staff)
        return Response(serializer.data)

    elif request.method == 'PATCH':  # ✅ New block for PATCH
        serializer = StaffSerializer(staff, data=request.data, partial=True)  # partial=True is key
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        staff.delete()
        return Response({'message': 'Staff deleted'}, status=status.HTTP_204_NO_CONTENT)
    

# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Career
from .serializers import CareerSerializer

# CREATE and READ ALL
@api_view(['GET', 'POST', 'DELETE'])
def career_list(request):
    if request.method == 'GET':
        careers = Career.objects.all().order_by('-applied_on')
        serializer = CareerSerializer(careers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = CareerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        count = Career.objects.all().delete()
        return Response(
            {'message': f'{count[0]} careers deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )

# GET ONE and DELETE ONE
@api_view(['GET', 'DELETE'])
def career_detail(request, pk):
    try:
        career = Career.objects.get(pk=pk)
    except Career.DoesNotExist:
        return Response({'error': 'Career not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CareerSerializer(career)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        career.delete()
        return Response({'message': 'Career deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
