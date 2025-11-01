from rest_framework import serializers
from .models import Person, Enquiry, Faculty, Student, Syllabus
from rest_framework.response import Response
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# REGISTER
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        return User.objects.create_user(**validated_data)

# LOGIN
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        user = authenticate(username=data.get("username"), password=data.get("password"))
        if user and user.is_active:
            data['user'] = user
            return data
        raise serializers.ValidationError("Invalid credentials or inactive user.")
    
# USER DETAILS
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        # exclude =['name']
        fields = "__all__"  
        # fields = "name"

    def validate(self,data):
        special_char = "!@#$%^&*()<>-=+"
        if any(c in special_char for c in data['fname']):
            raise serializers.ValidationError('name cannot contains special chars')   
        return data

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = '__all__'

from .models import QuickEnquiry
class QuickEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickEnquiry
        fields = '__all__'

from rest_framework import serializers
from .models import FacultyMember

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyMember
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

class SyllabusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Syllabus
        fields = '__all__'

from rest_framework import serializers
from .models import Attendance, AttendanceRecord, Student


# ----------------------------
# 1️⃣ Student Serializer
# ----------------------------
class StudentSerializer(serializers.ModelSerializer):
    """Serializer for full student info (used in other modules if needed)."""
    class Meta:
        model = Student
        fields = '__all__'


# ----------------------------
# 2️⃣ Simple Student Serializer
# ----------------------------
class SimpleStudentSerializer(serializers.ModelSerializer):
    """Minimal student info inside attendance record (for display only)."""
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'course']


# ----------------------------
# 3️⃣ Attendance Serializer
# ----------------------------
class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model (course + date)."""
    # Change TimeField to DateTimeField for full timestamp accuracy
    time_in = serializers.DateTimeField(format="%H:%M:%S", read_only=True)
    time_out = serializers.DateTimeField(format="%H:%M:%S", read_only=True)
    class Meta:
        model = Attendance
        fields = '__all__'

from rest_framework import serializers
from .models import AttendanceRecord, Student

class SimpleStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'course']

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student = SimpleStudentSerializer(read_only=True)
    student_id = serializers.CharField(write_only=True)
    time_in = serializers.DateTimeField(
        required=False,
        allow_null=True,
        # You can keep the time-only format here if you only want to display H:M:S
        format="%H:%M:%S", 
        # You can remove 'format' and handle the formatting in React, but keeping 
        # it here forces DRF to only output the time component string.
    )
    time_out = serializers.DateTimeField(
        required=False,
        allow_null=True,
        format="%H:%M:%S",
    )
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

    def validate(self, attrs):
        student_id = attrs.get('student_id')
        student = attrs.get('student')

        if not student and not student_id:
            raise serializers.ValidationError({'student_id': 'Student ID or Student PK is required.'})

        if not student:
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                raise serializers.ValidationError({'student_id': 'Student not found.'})

        attrs['student'] = student
        return attrs

    def create(self, validated_data):
        validated_data.pop('student_id', None)
        return AttendanceRecord.objects.create(**validated_data)


# decide  fees serializers
from .models import DecideFees
class DecideFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )

    class Meta:
        model = DecideFees
        fields = '__all__'

# decide   exam fees serializers
from .models import DecideExamFees
class DecideExamFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )

    class Meta:
        model = DecideExamFees
        fields = '__all__'


# decide   hostel fees serializers
from .models import DecideHostelFees
class DecideHostelFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )

    class Meta:
        model = DecideHostelFees
        fields = '__all__'


# decide   transport fees serializers
from .models import DecideTransportFees
class DecideTransportFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )

    class Meta:
        model = DecideTransportFees
        fields = '__all__'

# deposite fees serilaizer 
from .models import DpFees

class DpFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )
    class Meta:
        model = DpFees
        fields = '__all__'

# deposite exam fees serilaizer 
from .models import DpExamFees

class DpExamFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id',
        required=False   # <-- reference to your custom student_id field
    )
    class Meta:
        model = DpExamFees
        fields = '__all__'

# deposite hostel fees serilaizer 
from .models import DpHostelFees
class DpHostelFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )
    class Meta:
        model = DpHostelFees
        fields = '__all__'

# deposite transport fees serilaizer 
from .models import DpTransportFees
class DpTransportFeesSerializer(serializers.ModelSerializer):
    student = serializers.SlugRelatedField(
        queryset=Student.objects.all(),
        slug_field='student_id'   # <-- reference to your custom student_id field
    )
    class Meta:
        model = DpTransportFees
        fields = '__all__'

# serializers.py
from .models import Staff

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'

# career
from .models import Career

class CareerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Career
        fields = '__all__'
