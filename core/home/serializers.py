from rest_framework import serializers
from .models import Person, Enquiry, Faculty, Student, Syllabus
from rest_framework.response import Response

from django.contrib.auth.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'date_joined')
    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only = True)





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


# student serializers 

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'



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
        slug_field='student_id'   # <-- reference to your custom student_id field
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
